import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_nep5_txid", ["txid"], {})
@Entity("nep5", { schema: "squirrel" })
export class Nep5 {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "asset_id", length: 40 })
  assetId: string;

  @Column("char", { name: "admin_address", length: 40 })
  adminAddress: string;

  @Column("varchar", { name: "name", length: 128 })
  name: string;

  @Column("varchar", { name: "symbol", length: 16 })
  symbol: string;

  @Column("tinyint", { name: "decimals", unsigned: true })
  decimals: number;

  @Column("decimal", { name: "total_supply", precision: 64, scale: 22 })
  totalSupply: string;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("int", { name: "block_index", unsigned: true })
  blockIndex: number;

  @Column("bigint", { name: "block_time", unsigned: true })
  blockTime: string;

  @Column("bigint", { name: "addresses", unsigned: true })
  addresses: string;

  @Column("bigint", { name: "holding_addresses", unsigned: true })
  holdingAddresses: string;

  @Column("bigint", { name: "transfers", unsigned: true })
  transfers: string;

  @Column("tinyint", { name: "visible", width: 1, default: () => "'1'" })
  visible: boolean;
}
