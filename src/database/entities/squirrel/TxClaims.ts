import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_tx_claims_txid", ["txid"], {})
@Entity("tx_claims", { schema: "squirrel" })
export class TxClaims {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("int", { name: "vout", unsigned: true })
  vout: number;
}
