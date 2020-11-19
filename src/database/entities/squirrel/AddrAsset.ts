import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("addr_asset_address_asset_id_uindex", ["address", "assetId"], {
  unique: true,
})
@Index("addr_asset_asset_id_balance_index", ["assetId", "balance"], {})
@Entity("addr_asset", { schema: "squirrel" })
export class AddrAsset {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "address", length: 128 })
  address: string;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("decimal", { name: "balance", precision: 64, scale: 22 })
  balance: string;

  @Column("bigint", { name: "transactions", unsigned: true })
  transactions: string;

  @Column("bigint", { name: "last_transaction_time", unsigned: true })
  lastTransactionTime: string;
}
