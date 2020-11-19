import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_tx_scripts_txid", ["txid"], {})
@Entity("tx_scripts", { schema: "squirrel" })
export class TxScripts {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("text", { name: "invocation" })
  invocation: string;

  @Column("text", { name: "verification" })
  verification: string;
}
