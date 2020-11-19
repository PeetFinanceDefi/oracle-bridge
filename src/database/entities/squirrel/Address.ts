import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uk_address", ["address"], { unique: true })
@Entity("address", { schema: "squirrel" })
export class Address {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "address", unique: true, length: 128 })
  address: string;

  @Column("bigint", { name: "created_at", unsigned: true })
  createdAt: string;

  @Column("bigint", { name: "last_transaction_time", unsigned: true })
  lastTransactionTime: string;

  @Column("bigint", { name: "trans_asset", unsigned: true })
  transAsset: string;

  @Column("bigint", {
    name: "trans_nep5",
    unsigned: true,
    default: () => "'0'",
  })
  transNep5: string;

  @Column("bigint", { name: "trans_nft", unsigned: true, default: () => "'0'" })
  transNft: string;
}
