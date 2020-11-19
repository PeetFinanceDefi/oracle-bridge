import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_nep5_id", ["nep5Id"], {})
@Entity("nep5_reg_info", { schema: "squirrel" })
export class Nep5RegInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "nep5_id", unsigned: true })
  nep5Id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "version", length: 255 })
  version: string;

  @Column("varchar", { name: "author", length: 255 })
  author: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "description", length: 1024 })
  description: string;

  @Column("tinyint", { name: "need_storage", width: 1 })
  needStorage: boolean;

  @Column("varchar", { name: "parameter_list", length: 255 })
  parameterList: string;

  @Column("varchar", { name: "return_type", length: 255 })
  returnType: string;
}
