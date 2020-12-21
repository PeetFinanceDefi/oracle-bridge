import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pool_history", { schema: "peet" })
export class PoolHistory {
  @PrimaryGeneratedColumn({ type: "int", name: "idpool_history" })
  idpoolHistory: number;

  @Column("varchar", { name: "hash", nullable: true, length: 255 })
  hash: string | null;

  @Column("decimal", {
    name: "pooled_amount",
    nullable: true,
    precision: 18,
    scale: 8,
  })
  pooledAmount: string | null;
}
