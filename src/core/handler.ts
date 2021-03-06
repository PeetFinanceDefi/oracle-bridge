import { SwapRequest } from "../api/v1/requests/swapRequest";
import { SwapChain } from "../enums/swapChain";
import { factory } from "./../logger"
import { SwapRequestEntity } from "../database/entities/peet/SwapRequest"
import Web3 from "web3"
import moment from 'moment'
import { SwapResponse } from "../api/v1/requests/swapResponse";
import { SwapCancelRequest } from "../api/v1/requests/swapCancelRequest";
import MiscHelper from "../helpers/misc";
import { ethereumWatcher } from "./watchers/ethereum"
import { neoWatcher } from "./watchers/neo"
import { getConnection } from "typeorm";
import { config } from "../config";

const fs = require('fs') ;
const log = factory.getLogger("oracle");

export class CoreHandler {
    constructor()
    {
        this.initHandler()
    }

    private async reloadWaitingRequests() : Promise<SwapRequestEntity[]>
    {
        const parameters = { 
            now:  moment(new Date()).toDate(),
        }

        const activeRequests = await getConnection("peet").getRepository(SwapRequestEntity)
        .createQueryBuilder()
        .andWhere('expire_at > :now')
        .andWhere('ended = 0')
        .setParameters(parameters)
        .getMany()

        return activeRequests
    }

    public async swapPTE(request: SwapRequestEntity, receivedAmount: number, tx_id: string): Promise<boolean> {
        const existing = await getConnection("peet").getRepository(SwapRequestEntity)
            .createQueryBuilder()
            .where('tx_id = :txid')
            .andWhere('sent_amount > 0')
            .setParameters({txid: tx_id})
            .getOne()

        if (existing !== undefined) {
            return
        }

        log.info(`Preparing to send ~ ${receivedAmount} PTE to ${request.dstAddr} (${request.toChain}) (from tx: ${tx_id})`)
        let sentAmount: number = 0
        switch (request.toChain) {
            case "eth":
                sentAmount = Number(await ethereumWatcher.sendPTE(request, receivedAmount))
                break;
            
            case "neo":
                sentAmount = Number(await neoWatcher.sendPTE(request, receivedAmount))
                break;
        }
        if (sentAmount > 0) {
            await getConnection("peet").getRepository(SwapRequestEntity).update({idswapRequest: request.idswapRequest}, {
                ended: 1,
                txId: tx_id,
                receivedAmount: receivedAmount.toFixed(8),
                sentAmount: sentAmount.toFixed(8)
            })

            log.info(`Swap request for ${request.fromChain} tx_id ${tx_id} sucessfully ended. ${sentAmount} PTE sent on ${request.dstAddr} (${request.toChain})`)
        }
        
        return true
    }

    private async initHandler()
    {
        for (;;)
        {
            try
            {
                const requests: SwapRequestEntity[] = await this.reloadWaitingRequests()
                // watch chains
                // await ethereumWatcher.doJob(requests.filter(x => x.fromChain === "eth"))
                await neoWatcher.doJob(requests.filter(x => x.fromChain === "neo"))
            }
            catch (error)
            {
                console.error(error)
            }
            await MiscHelper.SleepSeconds(30)
        }
    }

    async cancelSwapRequest(swapCancelRequest: SwapCancelRequest): Promise<boolean | undefined>
    {
        const parameters = { 
            from_addr: swapCancelRequest.from_addr,
            now:  moment(new Date()).toDate(),
            pin_code: swapCancelRequest.pin_code
        }
        const activeRequest = await getConnection("peet").getRepository(SwapRequestEntity)
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
    
        await getConnection("peet").getRepository(SwapRequestEntity).update({idswapRequest: activeRequest.idswapRequest}, {
            ended: 1,
            expireAt: moment(new Date()).toDate()
        })
        return true
    }

    async getStateRequest(swapCancelRequest: SwapCancelRequest): Promise<any | undefined>
    {
        const parameters = { 
            from_addr: swapCancelRequest.from_addr,
            now:  moment(new Date()).toDate(),
        }
        const request = await getConnection("peet").getRepository(SwapRequestEntity)
            .createQueryBuilder()
            .where('from_addr = :from_addr')
            .andWhere('expire_at > :now')
            .orderBy("idswap_request", "DESC")
            .setParameters(parameters)
            .getOne()
        if (request === undefined) {
            return undefined
        }
    
        return {
            tx: request.txId,
            amount: Number(request.receivedAmount),
            ended: request.ended
        }
    }

    oracleAddr(chain: string) {
        switch (chain) {
            case "neo":
                return config.NeoAddr
            case "eth":
                return config.EthereumAddr
        }
    }

    async initSwapRequest(swapRequest: SwapRequest): Promise<SwapResponse>
    {
        try
        {
            const parameters = { 
                from_addr: swapRequest.from_addr,
                now:  moment(new Date()).toDate()
            }
            const waitingRequest = await getConnection("peet").getRepository(SwapRequestEntity)
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
                    dstAddr: waitingRequest.dstAddr,
                    oracleAddr: this.oracleAddr(waitingRequest.fromChain),
                    tx: waitingRequest.txId,
                    amount: Number(waitingRequest.receivedAmount)
                }
            }
        
            const expirationDate = moment(new Date()).add(1, 'hour')
            const pinCode: string = Math.random().toString().substr(2, 4)
            getConnection("peet").getRepository(SwapRequestEntity).insert({
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
                oracleAddr: this.oracleAddr(swapRequest.from_chain),
                tx: undefined,
                amount: 0
            }
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}

export let Core = new CoreHandler();