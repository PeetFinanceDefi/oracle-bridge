import { SwapRequestEntity } from "../../database/entities/SwapRequest";
import { config } from "../../config"
import { factory } from "../../logger"

const log = factory.getLogger("oracle");

export class EthereumWatcher
{
    public watch_addr: string
    constructor()
    {
        this.watch_addr = config.EthereumWatchAddress
    }

    public async doJob(requests: SwapRequestEntity[])
    {
        //console.log(requests)
    }
}

export let ethereumWatcher = new EthereumWatcher();