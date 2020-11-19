
import 'reflect-metadata'
import { createConnection } from 'typeorm';
import { factory } from "../logger"
import { config } from "../config"

const log = factory.getLogger("oracle");
class DatabaseHandler {

    public async initConnection(): Promise<boolean>
    {
        try {
            await createConnection({
                name: "peet",
                type: "mysql",
                host: config.dbHost,
                port: config.dbPort,
                username: config.dbUsername,
                password: config.dbPassword,
                database: config.dbPeetName,
                logging: false,
                entities: ["dist/database/entities/peet/*.js"],
                entityPrefix: undefined
            })
            
            await createConnection({
                name: "squirrel",
                type: "mysql",
                host: config.dbHost,
                port: config.dbPort,
                username: config.dbUsername,
                password: config.dbPassword,
                database: config.dbSquirrelName,
                logging: false,
                entities: ["dist/database/entities/squirrel/*.js"],
                entityPrefix: undefined
            })

            return true
        } catch(error) {
            console.error(error)
            return false
        }
    }
}

export let databaseHandler = new DatabaseHandler();
