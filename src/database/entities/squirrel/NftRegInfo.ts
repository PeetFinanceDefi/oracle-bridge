import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_nft_id", ["nftId"], {})
@Entity("nft_reg_info", { schema: "squirrel" })
export class NftRegInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "nft_id", unsigned: true })
  nftId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "version", length: 255 })
  version: string;

  @Column("varchar", { name: "author", length: 255 })
  author: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("tinyint", { name: "need_storage", width: 1 })
  needStorage: boolean;

  @Column("varchar", { name: "parameter_list", length: 255 })
  parameterList: string;

  @Column("varchar", { name: "return_type", length: 255 })
  returnType: string;
}
