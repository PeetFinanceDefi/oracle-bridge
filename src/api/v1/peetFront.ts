const router = require('express').Router();

import { factory } from "./../../logger"
import { etherScan } from "../../worker/etherScanInfos";
const log = factory.getLogger("oracle");
const request = require('request');

const RSS_URL = "https://medium.com/feed/@peetdefi"

let Parser = require('rss-parser');
let parser = new Parser();
router.get('/token', async (_: any, result: any) => {
    try {
        return result.send({result: true, price: etherScan.price, supply: etherScan.supply, addresses: etherScan.addresses});
    } catch(e) {
        console.error(e)
    }
});

router.get('/medium-rss', async (_: any, result: any) => {
    let feed = await parser.parseURL(RSS_URL);
    const rss: any[] = []
    feed.items.forEach((x: any) => {
        rss.push({
            title: x.title,
            date: x.pubDate,
            author: x.creator,
            link: x.link,
            snippet: x['content:encodedSnippet']
        })
    });
    return result.send(rss)
});

module.exports = router;