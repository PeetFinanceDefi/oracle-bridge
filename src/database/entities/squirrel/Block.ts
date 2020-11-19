import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_block_index", ["index"], { unique: true })
@Index("idx_block_hash", ["hash"], {})
@Index("idx_block_time", ["time"], {})
@Entity("block", { schema: "squirrel" })
export class Block {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "hash", length: 66 })
  hash: string;

  @Column("int", { name: "size" })
  size: number;

  @Column("int", { name: "version", unsigned: true })
  version: number;

  @Column("char", { name: "previousblockhash", length: 66 })
  previousblockhash: string;

  @Column("char", { name: "merkleroot", length: 66 })
  merkleroot: string;

  @Column("bigint", { name: "time", unsigned: true })
  time: string;

  @Column("int", { name: "index", unique: true, unsigned: true })
  index: number;

  @Column("char", { name: "nonce", length: 16 })
  nonce: string;

  @Column("char", { name: "nextconsensus", length: 34 })
  nextconsensus: string;

  @Column("text", { name: "script_invocation" })
  scriptInvocation: string;

  @Column("text", { name: "script_verification" })
  scriptVerification: string;

  @Column("char", { name: "nextblockhash", length: 66 })
  nextblockhash: string;
}
