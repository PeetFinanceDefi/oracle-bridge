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

    private between(min, max) {  
		return Math.floor(
			Math.random() * (max - min) + min
		)
	}

    public async sendPTE(request: SwapRequestEntity, amount: number): Promise<number>
    {
        return new Promise((resolve, _) => {
            try {
                var sentAmount: number = amount
                //from
                const p1 = sc.ContractParam.byteArray(
                    config.NeoAddr,
                    "address"
                );
                //dst
                const p2 = sc.ContractParam.byteArray(
                    request.dstAddr,
                    "address"
                )
                //amount
                const p3 =  Neon.create.contractParam("Integer", sentAmount * (10 ** 8));

                const fnc = { scriptHash: config.NeoAssetId, operation: 'transfer', args: [p1, p2, p3] }
                const script = Neon.create.script(fnc)
                // Create transaction object
                let rawTransaction = new tx.InvocationTransaction({
                    script: script,
                    // fees: 0.1,
                });
                // nonce
                const hexRemark = Neon.u.str2hexstring(this.between(0, 999999999).toString());
                rawTransaction.addAttribute(tx.TxAttrUsage.Remark, hexRemark);

                // Build input objects and output objects.
                rawTransaction.addAttribute(
                    tx.TxAttrUsage.Script,
                    u.reverseHex(wallet.getScriptHashFromAddress(this.account.address))
                );

                const signature = wallet.sign(
                    rawTransaction.serialize(false),
                    this.account.privateKey
                );
                rawTransaction.addWitness(
                    tx.Witness.fromSignature(signature, this.account.publicKey)
                );

                const client = new rpc.RPCClient(`${config.NeoNode}`);
                client
                .sendRawTransaction(rawTransaction)
                .then(res => {
                    resolve((res == true) ? sentAmount : -1)
                })
                .catch(err => {
                    console.log(err);
                    resolve(-1)
                });
                
            } catch (error) {
                console.error(error)
                resolve(-1)
            }
        })
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
            await MiscHelper.SleepSeconds(30)
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
                        await getConnection("peet").getRepository(SwapRequestEntity).update({idswapRequest: x.idswapRequest}, {
                            txId: tx.txid, 
                            receivedAmount: tx.value
                        })
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