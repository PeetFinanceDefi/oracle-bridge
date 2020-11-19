import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("nep5_migrate", { schema: "squirrel" })
export class Nep5Migrate {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "old_asset_id", length: 40 })
  oldAssetId: string;

  @Column("char", { name: "new_asset_id", length: 40 })
  newAssetId: string;

  @Column("char", { name: "migrate_txid", length: 66 })
  migrateTxid: string;
}
