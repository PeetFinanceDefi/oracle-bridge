import { factory } from "../logger"
import { config } from "../config"
import fs from "fs";
import Web3 from "web3"
import { getConnection } from "typeorm";
import { PoolHistory } from "../database/entities/peet/PoolHistory";
import { ChainId, Token, WETH, Fetcher, Route, TokenAmount, TradeType, Trade } from '@uniswap/sdk'

interface PriceCoin {
    coin: string,
    price: number
}

const log = factory.getLogger("oracle");
class CoinsPriceCache
{
    public web3: any
    public contract: any

    public prices: PriceCoin[] = []
    constructor()
    {
        this.web3 = new Web3(config.EthereumNode);
        this.prices.push({
            coin:"USDT",
            price: 1
        })
        this.loopRequest()
    }

    private async refreshPtePrice(): Promise<boolean>
    {
        const netId = await this.web3.eth.net.getId();
        const PTE = await Fetcher.fetchTokenData(netId, this.web3.utils.toChecksumAddress(config.EthereumAsset));
        const USDT = await Fetcher.fetchTokenData(netId, this.web3.utils.toChecksumAddress(config.EthUsdtContract));
        
        const pair = await Fetcher.fetchPairData(PTE, USDT);
        const route = new Route([pair], USDT)
        const result: number = parseFloat(parseFloat((parseFloat(route.midPrice.toSignificant(6)) * 1) as any).toFixed(8));
        const usdtPrice = 1 / result

        const coinPrice = this.prices.find(x => x.coin === "PTE")
        if (coinPrice !== undefined) {
            coinPrice.price = usdtPrice
        } else {
            this.prices.push({
                coin: "PTE",
                price: usdtPrice
            })
        }
        return true
    }

    private async refreshWethPrice(): Promise<boolean>
    {
        const netId = await this.web3.eth.net.getId();
        const PTE = await Fetcher.fetchTokenData(netId, this.web3.utils.toChecksumAddress(config.EthUsdtContract));
        const USDT = await Fetcher.fetchTokenData(netId, this.web3.utils.toChecksumAddress(config.EthWethContract));
        
        const pair = await Fetcher.fetchPairData(PTE, USDT);
        const route = new Route([pair], USDT)
        const result: number = parseFloat(parseFloat((parseFloat(route.midPrice.toSignificant(6)) * 1) as any).toFixed(8));
        const coinPrice = this.prices.find(x => x.coin === "WETH")
        if (coinPrice !== undefined) {
            coinPrice.price = result
        } else {
            this.prices.push({
                coin: "WETH",
                price: result
            })
        }
        return true
    }


    async refreshPrices()
    {
        try {
            await this.refreshPtePrice()
            await this.refreshWethPrice()
        } catch (e) { console.error(e) }
    }

    async loopRequest()
    {
        setInterval(async () => {
            try {
                await this.refreshPrices()
            } catch (e) { }
        }, (2 * 1000) * 60)// 1mins
    }
}

export let coinPriceCache = new CoinsPriceCache();