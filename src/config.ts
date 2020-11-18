import { ENV, loadConfig } from 'config-decorators'
import * as dotenv from 'dotenv'
import 'reflect-metadata'

export class Config {

	@ENV('DB_HOST', true)
	public dbHost: string

	@ENV('DB_PORT', true)
	public dbPort: number

	@ENV('DB_USERNAME', true)
	public dbUsername: string

	@ENV('DB_PASSWORD', true)
	public dbPassword: string
	@ENV('DB_NAME', true)
    public dbName: string
	
	
	@ENV('ETH_WATCH_ADDR', true)
    public EthereumWatchAddress: string
}

const loadConfigFromEnv = (): Config => {
	dotenv.config()
	return loadConfig(Config)
}

export let config = loadConfigFromEnv();
