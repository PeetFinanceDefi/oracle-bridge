export interface SwapResponse {
    pinCode: string | undefined,
    fromChain: string,
    toChain: string,
    fromAddr: string,
    dstAddr: string,
    expireAt: Date
    oracleAddr: string
}