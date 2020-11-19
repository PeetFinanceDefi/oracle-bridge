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

        const activeRequests = await getConnection("peet").getRepository(SwapRequestEntity)
        .createQueryBuilder()
        .andWhere('expire_at > :now')
        .andWhere('ended = 0')
        .setParameters(parameters)
        .getMany()

        return activeRequests
    }

    public async swapPTE(request: SwapRequestEntity, amount: number, tx_id: string): Promise<boolean> {
        log.info(`Sending ${amount} PTE to ${request.dstAddr} (${request.toChain}) (from tx: ${tx_id})`)
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
                await ethereumWatcher.doJob(requests.filter(x => x.fromChain === "eth"))
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

    oracleAddr(chain: string) {
        switch (chain) {
            case "neo":
                return config.NeoAddr
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
                    oracleAddr: this.oracleAddr(waitingRequest.fromChain)
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
                oracleAddr: this.oracleAddr(swapRequest.from_chain)
            }
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}

export let Core = new CoreHandler();