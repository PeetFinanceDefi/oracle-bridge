import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_tx_vin_from", ["from"], {})
@Index("idx_tx_vin_txid", ["txid"], {})
@Entity("tx_vin", { schema: "squirrel" })
export class TxVin {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "from", length: 66 })
  from: string;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("int", { name: "vout", unsigned: true })
  vout: number;
}
