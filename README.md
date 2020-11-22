# Peet Oracle Chain Swap

[![Build Status](https://travis-ci.com/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/)
____

Oracle-Bridge is the heart of the Chain Swap protocol for Peet Defi.
We are currently compatible with:
- Ethereum Blockchain
- Neo Blockchain
&nbsp; 
____

#### Building the oracle
```sh
$ npm install
```
#### Starting up the oracle
```sh
$ npm run start
$ npm run watch ---- To use for live watching while coding
```

Environment variables:

```DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_PEET_NAME=peet
DB_SQUIRREL_NAME=squirrel
UNISWAP_PEET_TOKEN=0x51bb9c623226ce781f4a54fc8f4a530a47142b6b
UNISWAP_ETH_TOKEN=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc
ETH_ASSET_ID=0x2158146e3012f671e4e3eee72611224027c3fcfd
ETH_ADDR=PUB_KEY
ETH_PRIVATE_KEY=PRIV_KEY
ETH_NODE=wss://ropsten.infura.io/ws/v3/token
ETH_CHAIN=ropsten
ETH_MIN_CONFS=5
NEO_NODE=localhost:10003
NEO_WIF=PRIV_KEY
NEO_ADDR=PUB_KEY
NEO_ASSET_ID=8d43107ded0b7430c1bcda123dd2f2fd27444c84
NEO_MIN_CONFS=5
```