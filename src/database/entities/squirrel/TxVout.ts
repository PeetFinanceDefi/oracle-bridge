import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_tx_vout_address", ["address"], {})
@Index("idx_tx_vout_asset_id", ["assetId"], {})
@Index("idx_tx_vout_txid", ["txid"], {})
@Entity("tx_vout", { schema: "squirrel" })
export class TxVout {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("int", { name: "n", unsigned: true })
  n: number;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("decimal", { name: "value", precision: 35, scale: 8 })
  value: string;

  @Column("char", { name: "address", length: 34 })
  address: string;
}
