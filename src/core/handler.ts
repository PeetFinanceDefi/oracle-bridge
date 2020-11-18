import { SwapRequest } from "../api/v1/requests/swapRequest";
import { SwapChain } from "../enums/swapChain";
import { factory } from "./../logger"
import { SwapRequestEntity } from "../database/entities/SwapRequest"
import { getRepository, In } from "typeorm"
import Web3 from "web3"
import moment from 'moment'
import { SwapResponse } from "../api/v1/requests/swapResponse";
import { SwapCancelRequest } from "../api/v1/requests/swapCancelRequest";
import MiscHelper from "../helpers/misc";
import { ethereumWatcher } from "./watchers/ethereum"

const fs = require('fs') ;
const log = factory.getLogger("oracle");

export class CoreHandler {

    private ethContract: any;
    private ethContractAddress: string = "0x45B7DC520714fFF64a00C62818FE0148c33A3265"
    private web3: Web3 = undefined

    constructor()
    {
        this.initHandler()
    }

    private async reloadWaitingRequests() : Promise<SwapRequestEntity[]>
    {
        const parameters = { 
            now:  moment(new Date()).toDate(),
        }

        const activeRequests = await getRepository(SwapRequestEntity)
        .createQueryBuilder()
        .andWhere('expire_at > :now')
        .andWhere('ended = 0')
        .setParameters(parameters)
        .getMany()

        return activeRequests
    }

    private async initHandler()
    {
        for (;;)
        {
            try
            {
                const requests: SwapRequestEntity[] = await this.reloadWaitingRequests()
                // watch chains
                await ethereumWatcher.doJob(requests.filter(x => x.fromChain === "eth"))
            }
            catch (error)
            {
                console.error(error)
            }
            await MiscHelper.SleepSeconds(1)
        }
    }

    // constructor()
    // {
    //     this.initEthContract()
    // }

    // async initEthContract() {
    //     this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    //     const json = JSON.parse(fs.readFileSync("./abi/swap.json"));
    //     this.ethContract = new this.web3.eth.Contract(json.abi, this.ethContractAddress);
    // }

    // async initEthSwapRequest(swapRequest: SwapRequest): Promise<boolean>
    // {
    //     try {
    //         const hashAmount = (await this.ethContract.methods.getHashAmount(swapRequest.from_addr,
    //             swapRequest.to_chain, swapRequest.hash).call()) as number
    //         const hashDestination = await this.ethContract.methods.getHashDestination(swapRequest.from_addr,
    //             swapRequest.to_chain, swapRequest.hash).call()

    //         if ((hashDestination === undefined || hashDestination.length == 0) || hashAmount <= 0) {
    //             log.info(`Invalid swap request received from ${swapRequest.from_addr}`)
    //             return false
    //         }

    //         log.info(`Init swap ${SwapChain.ETH} -> ${swapRequest.to_chain}: ${hashAmount} PET to address ${hashDestination}`)
    //         //TODO: save waiting state in sqlite database
    //         return true
    //     } catch (e) { 
    //         console.error(e)
    //         return false
    //     }
    // }

    async cancelSwapRequest(swapCancelRequest: SwapCancelRequest): Promise<boolean | undefined>
    {
        const parameters = { 
            from_addr: swapCancelRequest.from_addr,
            now:  moment(new Date()).toDate(),
            pin_code: swapCancelRequest.pin_code
        }
        const activeRequest = await getRepository(SwapRequestEntity)
            .createQueryBuilder()
            .where('from_addr = :from_addr')
            .andWhere('expire_at > :now')
            .andWhere('ended = 0')
            .andWhere('pin_code = :pin_code')
            .setParameters(parameters)
            .getOne()
        if (activeRequest === undefined) {
            return undefined
        }
    
        await getRepository(SwapRequestEntity).update({idswapRequest: activeRequest.idswapRequest}, {
            ended: 1,
            expireAt: moment(new Date()).toDate()
        })
        return true
    }

    async initSwapRequest(swapRequest: SwapRequest): Promise<SwapResponse>
    {
        try
        {
            const parameters = { 
                from_addr: swapRequest.from_addr,
                now:  moment(new Date()).toDate()
            }
            const waitingRequest = await getRepository(SwapRequestEntity)
                .createQueryBuilder()
                .where('from_addr = :from_addr')
                .andWhere('expire_at > :now')
                .andWhere('ended = 0')
                .setParameters(parameters)
                .getOne()

            if (waitingRequest !== undefined) {
                return {
                    pinCode: undefined,
                    expireAt: waitingRequest.expireAt,
                    fromChain: waitingRequest.fromChain,
                    toChain: waitingRequest.toChain,
                    fromAddr: waitingRequest.fromAddr,
                    dstAddr: waitingRequest.dstAddr
                }
            }
        
            const expirationDate = moment(new Date()).add(1, 'hour')
            const pinCode: string = Math.random().toString().substr(2, 4)
            getRepository(SwapRequestEntity).insert({
                fromChain: swapRequest.from_chain,
                toChain: swapRequest.to_chain,
                fromAddr: swapRequest.from_addr,
                dstAddr: swapRequest.to_addr,
                pinCode: pinCode,
                createdAt: new Date(),
                expireAt: expirationDate.toDate()
            })

            return {
                pinCode,
                expireAt: expirationDate.toDate(),
                fromChain: swapRequest.from_chain,
                toChain: swapRequest.to_chain,
                fromAddr: swapRequest.from_addr,
                dstAddr: swapRequest.to_addr,
            }
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}

export let Core = new CoreHandler();