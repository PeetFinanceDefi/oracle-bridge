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
	@ENV('DB_PEET_NAME', true)
	public dbPeetName: string
	
	@ENV('DB_SQUIRREL_NAME', true)
    public dbSquirrelName: string
	
	@ENV('ETH_WATCH_ADDR', true)
	public EthereumWatchAddress: string

	@ENV('ETHEREUM_NODE', true)
	public EthereumNode: string
	@ENV('ETHEREUM_NODE_WS', true)
	public EthereumNodeWebSocket: string

	@ENV('NEO_NODE', true)
	public NeoNode: string 

	@ENV('NEO_WIF', true)
	public NeoWif: string

	@ENV('NEO_ADDR', true)
	public NeoAddr: string

	@ENV('NEO_ASSET_ID', true)
	public NeoAssetId: string

	@ENV('NEO_MIN_CONFS', true)
	public NeoMinConfs: number
}

const loadConfigFromEnv = (): Config => {
	dotenv.config()
	return loadConfig(Config)
}

export let config = loadConfigFromEnv();
