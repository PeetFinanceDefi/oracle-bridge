import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_tx_attr_txid", ["txid"], {})
@Index("idx_tx_attr_usage", ["usage"], {})
@Entity("tx_attr", { schema: "squirrel" })
export class TxAttr {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("varchar", { name: "usage", length: 32 })
  usage: string;

  @Column("mediumtext", { name: "data" })
  data: string;
}
