const router = require('express').Router();

import { factory } from "./../../logger"
import { SwapRequest } from "./requests/swapRequest";
import { Core } from "../../core/handler"
import { SwapChain } from "../../enums/swapChain";
import { SwapCancelRequest } from "./requests/swapCancelRequest";

const log = factory.getLogger("oracle");

router.post('/init', async (request: any, result: any) => {
    try {
        const swapRequest: SwapRequest = request.body as SwapRequest
        var swapResult: any | undefined = await Core.initSwapRequest(swapRequest)
            
        if (swapResult === undefined) {
            return result.send({result: false, message: "Couldn't treat your swap request; please try again later."});
        }
        return result.send({result: true, message: "Swap initiated successfully.", data: swapResult});
    } catch(e) {
        console.error(e)
        return result.send({result: false, message: "Couldn't treat your swap request; please try again later."});
    }
});

router.post('/cancel', async (request: any, result: any) => {
    try {
        const swapCancelRequest: SwapCancelRequest = request.body as SwapCancelRequest
        var swapResult: any | undefined = await Core.cancelSwapRequest(swapCancelRequest)
        if (swapResult === undefined) {
            return result.send({result: false, message: "Couldn't cancel your swap request, please verify your PIN Code."});
        }

        return result.send({result: true, message: "Swap request cancelled. Reload the page if you want to start again."})
    } catch(e) {
        console.error(e)
        return result.send({result: false, message: "Couldn't cancel your swap; please try again later."});
    }
})

router.post('/state', async (request: any, result: any) => {
    try {
        const swapCancelRequest: SwapCancelRequest = request.body as SwapCancelRequest
        var stateResult: any | undefined = await Core.getStateRequest(swapCancelRequest)
        if (stateResult === undefined) {
            return result.send({result: false, message: "Couldn't get state."});
        }

        return result.send({result: true, message: "State successfully updated", data: stateResult})
    } catch(e) {
        console.error(e)
        return result.send({result: false, message: "Please try again later."});
    }
})

module.exports = router;