import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("counter", { schema: "squirrel" })
export class Counter {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "last_block_index" })
  lastBlockIndex: number;

  @Column("int", { name: "last_tx_pk", unsigned: true })
  lastTxPk: number;

  @Column("int", { name: "last_asset_tx_pk", unsigned: true })
  lastAssetTxPk: number;

  @Column("int", { name: "last_tx_pk_for_nep5", unsigned: true })
  lastTxPkForNep5: number;

  @Column("int", { name: "app_log_idx" })
  appLogIdx: number;

  @Column("int", { name: "last_tx_pk_for_nft", unsigned: true })
  lastTxPkForNft: number;

  @Column("int", { name: "nft_app_log_idx" })
  nftAppLogIdx: number;

  @Column("int", { name: "last_tx_pk_for_sc", unsigned: true })
  lastTxPkForSc: number;

  @Column("int", { name: "nep5_tx_pk_for_addr_tx", unsigned: true })
  nep5TxPkForAddrTx: number;

  @Column("int", { name: "nft_tx_pk_for_addr_tx", unsigned: true })
  nftTxPkForAddrTx: number;

  @Column("int", { name: "last_tx_pk_gas_balance", unsigned: true })
  lastTxPkGasBalance: number;

  @Column("int", { name: "cnt_addr", unsigned: true })
  cntAddr: number;

  @Column("int", { name: "cnt_tx_reg", unsigned: true })
  cntTxReg: number;

  @Column("int", { name: "cnt_tx_miner", unsigned: true })
  cntTxMiner: number;

  @Column("int", { name: "cnt_tx_issue", unsigned: true })
  cntTxIssue: number;

  @Column("int", { name: "cnt_tx_invocation", unsigned: true })
  cntTxInvocation: number;

  @Column("int", { name: "cnt_tx_contract", unsigned: true })
  cntTxContract: number;

  @Column("int", { name: "cnt_tx_claim", unsigned: true })
  cntTxClaim: number;

  @Column("int", { name: "cnt_tx_publish", unsigned: true })
  cntTxPublish: number;

  @Column("int", { name: "cnt_tx_enrollment", unsigned: true })
  cntTxEnrollment: number;
}
