import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_nep5_tx_asset_id", ["assetId"], {})
@Index("idx_nep5_tx_from", ["from"], {})
@Index("idx_nep5_tx_to", ["to"], {})
@Index("idx_nep5_tx_txid", ["txid"], {})
@Index("idx_nep5_created_at", ["createdAt"], {})
@Entity("nep5_tx", { schema: "squirrel" })
export class Nep5Tx {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("char", { name: "asset_id", length: 40 })
  assetId: string;

  @Column("varchar", { name: "from", length: 128 })
  from: string;

  @Column("varchar", { name: "to", length: 128 })
  to: string;

  @Column("decimal", { name: "value", precision: 64, scale: 22 })
  value: string;

  @Column("int", { name: "block_index", unsigned: true })
  blockIndex: number;

  @Column("bigint", { name: "block_time", unsigned: true })
  blockTime: string;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
