import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("nft_token", { schema: "squirrel" })
export class NftToken {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("char", { name: "token_id", length: 66 })
  tokenId: string;

  @Column("varchar", { name: "info", length: 4096 })
  info: string;
}
