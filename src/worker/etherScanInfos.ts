import { factory } from "../logger"

const request = require('request');
const log = factory.getLogger("oracle");
class EtherScanInfos
{
    url: string = "https://etherscan.io/token/0x51bb9c623226ce781f4a54fc8f4a530a47142b6b"
    public price: number = 0.00
    public supply: number = 0.00

    public addresses: number = 0
    constructor()
    {
        this.loopRequest()
    }


    doFetchTokenInfos(): Promise<any>
    {
        return new Promise((res, rej) => {
            request(this.url, (error: any, response: any, body: any) => {
                try {
                    if (error != null || response.statusCode !== 200) { throw error }
                    const lines: string[] = body.match(/[^\r\n]+/g);
                    lines.forEach((x: string, i:number) => {
                        if (x.includes("small text-secondary text-nowrap")) {
                            const matches = x.match(/(\d+(?:[\.,](?![\.,])\d+)*)/)
                            this.price = Number(matches ? matches[0] : 0)
                        } else if(x.includes("Circulating Supply MarketCap")) {
                            const supply = lines[i+1] 
                            const matches = supply.match(/(\d+(?:[\.,](?![\.,])\d+)*)/)
                            this.supply = Number(matches ? matches[0].replace(/,/g,'') : 0)
                            
                        } else if(x.includes("addresses</div>")) {
                            const matches = x.match(/^[0-9]*/)
                            this.addresses = Number(matches ? matches[0] : 0)
                        }
                    })
                    log.info(`Eth PTE Updated: Price: ${etherScan.price}$, Mcap: ${etherScan.supply}$, Hodlers: ${etherScan.addresses} addresses`)
                    res()
                } catch(e) { console.error(e); rej() }
            });
        })
    }

    loopRequest()
    {
        setInterval(async () => {
            await this.doFetchTokenInfos()
        }, (3 * 1000) * 60) // 3mins
    }
}

export let etherScan = new EtherScanInfos();