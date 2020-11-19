import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_utxo_address", ["address"], {})
@Index("idx_utxo_asset_id", ["assetId"], {})
@Index("idx_utxo_txid", ["txid"], {})
@Index("idx_utxo_used_in_tx", ["usedInTx"], {})
@Entity("utxo", { schema: "squirrel" })
export class Utxo {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "address", length: 34 })
  address: string;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("int", { name: "n", unsigned: true })
  n: number;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("decimal", { name: "value", precision: 35, scale: 8 })
  value: string;

  @Column("char", { name: "used_in_tx", nullable: true, length: 66 })
  usedInTx: string | null;
}
