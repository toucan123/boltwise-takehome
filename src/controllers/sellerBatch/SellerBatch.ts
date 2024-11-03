import { Type, Static } from '@sinclair/typebox';

export const SellerBatchParams = Type.Object({
  seller: Type.String(),
  batch: Type.String(),
});
export type SellerBatchParams = Static<typeof SellerBatchParams>;

export class SellerBatch implements SellerBatchParams {
  readonly seller: string;
  readonly batch: string;
  
  constructor(params: SellerBatchParams) {
    this.seller = params.seller;
    this.batch = params.batch;
  }
}