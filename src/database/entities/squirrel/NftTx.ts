import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_nft_tx_asset_id", ["assetId"], {})
@Index("idx_nft_tx_from", ["from"], {})
@Index("idx_nft_tx_to", ["to"], {})
@Index("idx_nft_tx_txid", ["txid"], {})
@Entity("nft_tx", { schema: "squirrel" })
export class NftTx {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "txid", length: 66 })
  txid: string;

  @Column("char", { name: "asset_id", length: 40 })
  assetId: string;

  @Column("varchar", { name: "from", length: 128 })
  from: string;

  @Column("varchar", { name: "to", length: 128 })
  to: string;

  @Column("varchar", { name: "token_id", length: 64 })
  tokenId: string;

  @Column("double", { name: "value", precision: 22 })
  value: number;

  @Column("int", { name: "block_index", unsigned: true })
  blockIndex: number;

  @Column("bigint", { name: "block_time", unsigned: true })
  blockTime: string;
}
