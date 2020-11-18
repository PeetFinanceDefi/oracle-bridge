import { SwapChain } from "../../../enums/swapChain";

export interface SwapRequest {
    from_chain: SwapChain
    to_chain: SwapChain
    from_addr: string
    to_addr: string
}