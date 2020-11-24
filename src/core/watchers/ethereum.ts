import { SwapRequestEntity } from "../../database/entities/peet/SwapRequest";
import { config } from "../../config"
import { factory } from "../../logger"
import fs from "fs";
import Web3 from "web3"
import { Transaction } from "ethereumjs-tx";
import { ChainId, Token, WETH, Fetcher, Route, TokenAmount, TradeType, Trade } from '@uniswap/sdk'
import { Core } from "../handler";
import { getConnection } from "typeorm";
import moment from 'moment'

const log = factory.getLogger("oracle");

export class EthereumWatcher
{
    public watch_addr: string
    public web3: any
    public wallet: any
    currentPteEthPrice: number
    constructor()
    {
        this.watch_addr = config.EthereumAsset
        this.web3 = new Web3(config.EthereumNode);
        this.wallet = this.web3.eth.accounts.privateKeyToAccount(config.EthereumPrivateKey);

        this.watchPrice()
        this.watchTransfers()
    }

    async watchPrice() {
        this.currentPteEthPrice = await this.convertEthPriceToPtePrice(1);
        log.info("Current ETH/PTE price is : " + this.currentPteEthPrice);
        setInterval(async () => {
            this.currentPteEthPrice = await this.convertEthPriceToPtePrice(1);
            log.info("Current ETH/PTE price is : " + this.currentPteEthPrice);
        }, 60000 * 1)
    }

    async waitConfirmationsLoop(event: any)
    {
        setTimeout(async () => {
            const blockTx = event.blockNumber
            const currentBlock = await this.web3.eth.getBlockNumber()

            const diffBlocks = currentBlock - blockTx
            if (diffBlocks > config.EthereumMinConfirmations) {
                log.info(`(Eth Chain) Tx ${ event.transactionHash}: confirmed within ${diffBlocks} blocks...`)
                return this.handleRequest(event)
            } else {
                log.info(`(Eth Chain) Tx ${ event.transactionHash}: ${diffBlocks}/${config.EthereumMinConfirmations} confirmation(s)`)
            }

            this.waitConfirmationsLoop(event)
        }, 10000);
    }

    async watchTransfers()
    {
        const abi = JSON.parse(fs.readFileSync('./abi/pte_eth.json', 'utf-8'));
        const contract = new this.web3.eth.Contract(abi, config.EthereumAsset);
        contract.events.Transfer({}, async (error, event) => {
            if (error) { console.error(error)}
            if (event.returnValues.to === config.EthereumAddr) {
                const value = event.returnValues.value / (10 ** 18)
                log.info(`(ETH) Received ${value} PTE from: ${event.returnValues.from}`)
                this.waitConfirmationsLoop(event)
                
            }
        })
    }
    
    async handleRequest(tx: any)
    {
        const amountReceived = tx.returnValues.value / (10 ** 18)
        const request = await getConnection("peet").getRepository(SwapRequestEntity)
        .createQueryBuilder()
        .where('from_addr = :from_addr')
        .andWhere('expire_at > :now')
        .andWhere('ended = 0')
        .orderBy("idswap_request", "DESC")
        .setParameters({now: moment(new Date()).toDate(), from_addr: tx.returnValues.from})
        .getOne()

        if (request === undefined) {
            return log.error(`Cant find waiting request for received ETH from: ${tx.returnValues.from}`)
        }

        await getConnection("peet").getRepository(SwapRequestEntity).update({idswapRequest: request.idswapRequest}, {
            txId: tx.transactionHash,
            receivedAmount: amountReceived.toFixed(8)
        })

        await Core.swapPTE(request, Number(amountReceived), tx.transactionHash)
    }

    async getEstimateGas(to, data) {
        var result = await this.web3.eth.estimateGas({
            to: to, 
            data: data
        });
        return result;
    }

    async getGasPriceAsEth() {
        const gasPrice = await this.web3.eth.getGasPrice()
        return this.web3.utils.fromWei(gasPrice, 'ether')
    }

    async convertEthPriceToPtePrice(amount): Promise<number> {
        const PTE = await Fetcher.fetchTokenData(ChainId.MAINNET, this.web3.utils.toChecksumAddress(config.UniswapPeetToken));
        const ETH = await Fetcher.fetchTokenData(ChainId.MAINNET, this.web3.utils.toChecksumAddress(config.UniswapWrappedEthToken));
        
        const pair = await Fetcher.fetchPairData(PTE, ETH);
        const route = new Route([pair], ETH)
        const result = Number(parseFloat(route.midPrice.toSignificant(6)) * amount);
        return result;
    }

    public async sendPTE(request: SwapRequestEntity, amount: any): Promise<number>
    {
        try {
            const abiArray = JSON.parse(fs.readFileSync('./abi/pte_eth.json', 'utf-8'));
            const contractAddress = config.EthereumAsset;
            const contract = new this.web3.eth.Contract(abiArray, contractAddress);
            const count = await this.web3.eth.getTransactionCount(config.EthereumAddr);

            let data = contract.methods.transfer(request.dstAddr, this.web3.utils.toWei(amount.toString(), 'ether')).encodeABI();
            const baseGasPriceEth = await this.getGasPriceAsEth();
            const estimatedGasPrice =  await this.getEstimateGas(request.dstAddr, data)
            const gasPrice = (estimatedGasPrice * baseGasPriceEth);
            amount = (amount - await this.convertEthPriceToPtePrice(gasPrice)).toFixed(8);

            console.log(estimatedGasPrice)
            let rawTransaction = {
                "chainId": 1,
                "from": config.EthereumAddr,
                "nonce": "0x" + count.toString(16),
                "gas": this.web3.utils.toHex(estimatedGasPrice + 21000),
                "gasPrice": this.web3.utils.toHex(this.web3.utils.toWei(baseGasPriceEth.toString(), 'ether')),
                "gasLimit": this.web3.utils.toHex((await this.web3.eth.getBlock("latest")).gasLimit),
                "to": contractAddress,
                "value": "0x0",
                "data": contract.methods.transfer(request.dstAddr, this.web3.utils.toWei(amount.toString(), 'ether')).encodeABI(),
            };

            var privKey = Buffer.from(config.EthereumPrivateKey, 'hex');
            var tx = new Transaction(rawTransaction, { chain: config.EthereumChain });
            tx.sign(privKey);
            var serializedTx = tx.serialize();
            log.info(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
            var receipt = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
            log.info("TxHash: " + receipt.transactionHash);
            return amount
        } catch (e) { 
            console.error(e)
            return -1
        }
    }
}

export let ethereumWatcher = new EthereumWatcher();