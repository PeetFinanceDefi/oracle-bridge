import e from "express";
import { HttpServer } from "./api/server"
import { factory } from "./logger"
import { etherScan } from "./worker/etherScanInfos";
import { poolStakingHistory } from "./worker/poolStakingHistory";
import { databaseHandler } from "./database/databaseHandler"
import { coinPriceCache } from "./worker/coinsPriceCache"

const log = factory.getLogger("oracle");

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    process.exit(-1)
  });

(async () => {

    
    try { 
        const httpPort = 1337

        log.info(`Starting the Oracle Engine...`)

        
        // init cache price
        await coinPriceCache.refreshPrices()

        // init db
        await databaseHandler.initConnection()
        
        // fetching token info
        await etherScan.doFetchTokenInfos()

        // pool history cache
        await poolStakingHistory.refreshHistoryLivePools()

        // starting api server
        const api: HttpServer = new HttpServer(httpPort);
        await api.StartServer()

        log.info(`Api successfully listening on port ${httpPort}`)
    } catch (e) {
        console.error(e)
    }
})()