import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("addr_asset_nft", { schema: "squirrel" })
export class AddrAssetNft {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "address", length: 128 })
  address: string;

  @Column("char", { name: "asset_id", length: 66 })
  assetId: string;

  @Column("char", { name: "token_id", length: 66 })
  tokenId: string;

  @Column("decimal", { name: "balance", precision: 35, scale: 8 })
  balance: string;
}
