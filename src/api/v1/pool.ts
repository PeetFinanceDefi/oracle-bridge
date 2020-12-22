const router = require('express').Router();

import { factory } from "../../logger"
import { SwapRequest } from "./requests/swapRequest";
import { Core } from "../../core/handler"
import { getConnection } from "typeorm";
import { PoolHistory } from "../../database/entities/peet/PoolHistory";

function reduceArraySize(array: any[]): any[] {

    let newArray = []
    const len: number = array.length
    if (len <= 7) { return array }

    array.forEach((x, i) => {
        if (i == 0 || (i % 2 == (len % 2) ? 0 : 1)) { newArray.push(x) }
    })

    if (newArray.length > 7) { 
        newArray = reduceArraySize(newArray)
    }

    return newArray
}

router.get('/history/:poolId', async (request: any, result: any) => {
    try {
        const poolId: string = request.params["poolId"]
        const history = await getConnection("peet").getRepository(PoolHistory).find({hash: poolId})
        let data =  history.map(x => x.pooledAmount)
        data = data.filter((elem, pos) => {
            if (Number(elem) <= 0) { return false }
            return data.indexOf(elem) == pos;
        })
        data = reduceArraySize(data)

        return result.send({result: true, message: "Pool history pooled", data});
    } catch(e) {
        console.error(e)
        return result.send({result: false, message: "Couldn't treat your request; please try again later."});
    }
});

module.exports = router;