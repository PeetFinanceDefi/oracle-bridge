import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_address_date", ["address", "date"], {})
@Entity("addr_gas_balance_5", { schema: "squirrel" })
export class AddrGasBalance_5 {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "address", length: 34 })
  address: string;

  @Column("date", { name: "date" })
  date: string;

  @Column("decimal", { name: "balance", precision: 35, scale: 8 })
  balance: string;
}
