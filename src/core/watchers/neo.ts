import { SwapRequestEntity } from "../../database/entities/peet/SwapRequest";
import { config } from "../../config"
import { factory } from "../../logger"
import Web3 from "web3"
import { getConnection } from "typeorm";
import { Nep5Tx } from "../../database/entities/squirrel/Nep5Tx";
import MiscHelper from "../../helpers/misc";
import { Counter } from "../../database/entities/squirrel/Counter";
import { Core } from "../handler";

const { default: Neon, rpc, api, wallet, sc, tx, u  } = require("@cityofzion/neon-js");
const log = factory.getLogger("oracle");

export class NeoWatcher
{
    public watch_addr: string
    public wallet: any
    public account: any
    constructor()
    {
        this.watch_addr = config.NeoAddr
        const netConfig = {
                name: "Net",
                nodes: [
                    config.NeoNode,
                ]
            };
        
        const privateNet = new rpc.Network(netConfig);
        Neon.add.network(privateNet, true);
        
        this.wallet = Neon.create.wallet({ name: "oracle" });
        this.wallet.addAccount();
        
        const WIF = config.NeoWif;
        this.account = new wallet.Account(WIF);
        this.wallet.addAccount(this.account);
    }

    public async waitBlocks(tx: Nep5Tx, request: SwapRequestEntity): Promise<boolean> {
        log.info(`(Neo Chain) Received ${tx.value} PTE from ${tx.from}, dst: ${request.dstAddr} (to ${request.toChain.toUpperCase()}), waiting for confirmations..`)

        var loop_tick = 0
        for (;;)
        {
            if (loop_tick >= 5) {
                break;
            }

            try
            {
                const counter = await getConnection("squirrel").getRepository(Counter).findOne({id: 1})
                const diffBlocks: number = counter.lastBlockIndex - tx.blockIndex
                log.info(`(Neo Chain) lastBlock: ${counter.lastBlockIndex} from tx on ${tx.blockIndex}: ${diffBlocks} confirmation(s)`)
                if (diffBlocks >= config.NeoMinConfs) {
                    return true;
                }
                loop_tick++
            }
            catch (error)
            {
                console.error(error)
            }
            await MiscHelper.SleepSeconds(60)
        }

        return false
    }

    public async doJob(requests: SwapRequestEntity[]): Promise<any>
    {
        const promises: any = []
        requests.forEach(x => {
            promises.push(new Promise(async (res, rej) => {
                try {
                    const parameters = { 
                        request_date: x.createdAt,
                        asset: config.NeoAssetId,
                        from_addr: x.fromAddr,
                        to_addr: config.NeoAddr
                    }
        
                    //watch squirrel new received tx for swap request
                    const tx = await getConnection("squirrel").getRepository(Nep5Tx)
                    .createQueryBuilder()
                    .where('`from` = :from_addr')
                    .andWhere('`to` = :to_addr')
                    .andWhere('created_at > :request_date')
                    .andWhere('asset_id = :asset')
                    .setParameters(parameters)
                    .getOne()
        
                    // received funds!
                    if (tx !== undefined) {
                        const confirmed = await this.waitBlocks(tx, x)
                        if (confirmed) {
                            await Core.swapPTE(x, Number(tx.value), tx.txid)
                        }
                    }
                    res()
                } catch(e) {
                    console.error(e)
                    res()
                }
            }))
        })

        await Promise.all(promises)
        return true
    }
}

export let neoWatcher = new NeoWatcher();