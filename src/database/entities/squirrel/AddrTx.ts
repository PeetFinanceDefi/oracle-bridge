import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "addr_tx_address_asset_type_txid_uindex",
  ["address", "assetType", "txid"],
  { unique: true }
)
@Index("addr_tx_txid", ["txid"], {})
@Index("addr_tx_address", ["address"], {})
@Entity("addr_tx", { schema: "squirrel" })
export class AddrTx {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("varchar", { name: "address", length: 128 })
  address: string;

  @Column("bigint", { name: "block_time", unsigned: true })
  blockTime: string;

  @Column("varchar", { name: "asset_type", length: 16 })
  assetType: string;
}
