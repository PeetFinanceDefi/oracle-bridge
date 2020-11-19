import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_asset_tx_address_asset_id_txid", ["address", "assetId", "txid"], {
  unique: true,
})
@Index("idx_asset_tx_address_asset_id", ["address", "assetId"], {})
@Entity("asset_tx", { schema: "squirrel" })
export class AssetTx {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "address", length: 34 })
  address: string;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("char", { name: "txid", length: 66 })
  txid: string;
}
