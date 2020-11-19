import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_tx_block_index", ["blockIndex"], {})
@Index("idx_tx_txid", ["txid"], {})
@Index("idx_tx_type", ["type"], {})
@Entity("tx", { schema: "squirrel" })
export class Tx {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "block_index", unsigned: true })
  blockIndex: number;

  @Column("bigint", { name: "block_time", unsigned: true })
  blockTime: string;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("int", { name: "size", unsigned: true })
  size: number;

  @Column("varchar", { name: "type", length: 32 })
  type: string;

  @Column("int", { name: "version", unsigned: true })
  version: number;

  @Column("decimal", { name: "sys_fee", precision: 27, scale: 8 })
  sysFee: string;

  @Column("decimal", { name: "net_fee", precision: 27, scale: 8 })
  netFee: string;

  @Column("bigint", { name: "nonce" })
  nonce: string;

  @Column("mediumtext", { name: "script" })
  script: string;

  @Column("decimal", { name: "gas", precision: 27, scale: 8 })
  gas: string;
}
