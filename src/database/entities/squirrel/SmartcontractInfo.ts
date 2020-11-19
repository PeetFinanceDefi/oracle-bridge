import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_script_hash", ["scriptHash"], {})
@Entity("smartcontract_info", { schema: "squirrel" })
export class SmartcontractInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("char", { name: "script_hash", length: 40 })
  scriptHash: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "version", length: 255 })
  version: string;

  @Column("varchar", { name: "author", length: 255 })
  author: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "description", length: 2048 })
  description: string;

  @Column("tinyint", { name: "need_storage", width: 1 })
  needStorage: boolean;

  @Column("varchar", { name: "parameter_list", length: 255 })
  parameterList: string;

  @Column("varchar", { name: "return_type", length: 255 })
  returnType: string;
}
