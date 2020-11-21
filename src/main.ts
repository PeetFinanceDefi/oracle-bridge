import e from "express";
import { HttpServer } from "./api/server"
import { factory } from "./logger"
import { etherScan } from "./worker/etherScanInfos";
import { databaseHandler } from "./database/databaseHandler"

const log = factory.getLogger("oracle");

(async () => {
    try { 
        const httpPort = 1337

        log.info(`Starting the Oracle Engine...`)

        
        // init db
        await databaseHandler.initConnection()
        
        // fetching token info
        await etherScan.doFetchTokenInfos()

        // starting api server
        const api: HttpServer = new HttpServer(httpPort);
        await api.StartServer()

        log.info(`Api successfully listening on port ${httpPort}`)
    } catch (e) {
        console.error(e)
    }
})()