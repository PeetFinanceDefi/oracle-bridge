const router = require('express').Router();

import { factory } from "../../logger"
import { SwapRequest } from "./requests/swapRequest";
import { Core } from "../../core/handler"
import { getConnection } from "typeorm";
import { PoolHistory } from "../../database/entities/peet/PoolHistory";

router.get('/history/:poolId', async (request: any, result: any) => {
    try {
        const poolId: string = request.params["poolId"]
        const history = await getConnection("peet").getRepository(PoolHistory).find({hash: poolId})
        return result.send({result: true, message: "Pool history pooled", data: history.map(x => x.pooledAmount)});
    } catch(e) {
        console.error(e)
        return result.send({result: false, message: "Couldn't treat your request; please try again later."});
    }
});

module.exports = router;