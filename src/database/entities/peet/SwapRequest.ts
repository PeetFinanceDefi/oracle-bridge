import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("swap_request", { schema: "peet" })
export class SwapRequestEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "idswap_request" })
  idswapRequest: number;

  @Column("varchar", { name: "from_addr", nullable: true, length: 500 })
  fromAddr: string | null;

  @Column("varchar", { name: "dst_addr", nullable: true, length: 45 })
  dstAddr: string | null;

  @Column("varchar", { name: "pin_code", nullable: true, length: 10 })
  pinCode: string | null;

  @Column("varchar", { name: "from_chain", nullable: true, length: 50 })
  fromChain: string | null;

  @Column("varchar", { name: "to_chain", nullable: true, length: 50 })
  toChain: string | null;

  @Column("decimal", {
    name: "received_amount",
    nullable: true,
    precision: 10,
    scale: 0,
    default: () => "'0'",
  })
  receivedAmount: string | null;

  @Column("decimal", {
    name: "sent_amount",
    nullable: true,
    precision: 10,
    scale: 0,
    default: () => "'0'",
  })
  sentAmount: string | null;

  @Column("tinyint", { name: "ended", nullable: true, default: () => "'0'" })
  ended: number | null;

  @Column("varchar", { name: "tx_id", nullable: true, length: 255 })
  txId: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "expire_at", nullable: true })
  expireAt: Date | null;
}
