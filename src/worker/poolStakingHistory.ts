import { factory } from "../logger"
import { config } from "../config"
import fs from "fs";
import Web3 from "web3"
import { getConnection } from "typeorm";
import { PoolHistory } from "../database/entities/peet/PoolHistory";

const log = factory.getLogger("oracle");
class PoolStakingHistory
{
    public web3: any
    public contract: any
    constructor()
    {
        this.web3 = new Web3(config.EthereumNode);
        const abi = JSON.parse(fs.readFileSync('./abi/staking.json', 'utf-8'));
        this.contract = new this.web3.eth.Contract(abi, config.EthereumStakingContract);

        this.loopRequest()
    }

    async refreshHistoryLivePools()
    {
        const livePoolsRaw = await this.contract.methods.fetchLivePools().call()
        const livePoolsPlusRaw = await this.contract.methods.fetchLivePoolsPlus().call()
        const pools = []

        for (var i = 0; i < livePoolsRaw[0].length; i++) {
            pools.push({
                indice: livePoolsRaw[0][i],
                amount: Number(livePoolsPlusRaw[1][i]) / (10 ** 18)
            })
        }

        pools.forEach(async (x) => {
            const saved = await getConnection("peet").getRepository(PoolHistory).findOne({hash: x.indice, pooledAmount: x.amount})
            if (saved !== undefined) { return }
            await getConnection("peet").getRepository(PoolHistory).insert({
                hash: x.indice,
                pooledAmount: x.amount
            })
        })
    }

    async loopRequest()
    {
        setInterval(async () => {
            await this.refreshHistoryLivePools()
        }, (1 * 1000) * 60) // 1mins
    }
}

export let poolStakingHistory = new PoolStakingHistory();