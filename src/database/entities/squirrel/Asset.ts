import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_asset_asset_id", ["assetId"], {})
@Index("idx_asset_time", ["blockTime"], {})
@Entity("asset", { schema: "squirrel" })
export class Asset {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "block_index", unsigned: true })
  blockIndex: number;

  @Column("bigint", { name: "block_time", unsigned: true })
  blockTime: string;

  @Column("int", { name: "version", unsigned: true })
  version: number;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("varchar", { name: "type", length: 32 })
  type: string;

  @Column("varchar", { name: "name", length: 256 })
  name: string;

  @Column("decimal", { name: "amount", precision: 35, scale: 8 })
  amount: string;

  @Column("decimal", { name: "available", precision: 35, scale: 8 })
  available: string;

  @Column("tinyint", { name: "precision", unsigned: true })
  precision: number;

  @Column("char", { name: "owner", length: 66 })
  owner: string;

  @Column("char", { name: "admin", length: 34 })
  admin: string;

  @Column("char", { name: "issuer", length: 66 })
  issuer: string;

  @Column("bigint", { name: "expiration", unsigned: true })
  expiration: string;

  @Column("tinyint", { name: "frozen", width: 1 })
  frozen: boolean;

  @Column("bigint", { name: "addresses", unsigned: true })
  addresses: string;

  @Column("bigint", { name: "transactions", unsigned: true })
  transactions: string;

  @Column("tinyint", { name: "visible", width: 1, default: () => "'1'" })
  visible: boolean;
}
