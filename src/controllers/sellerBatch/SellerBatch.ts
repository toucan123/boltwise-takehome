import { Type, Static } from '@sinclair/typebox';
import crypto from 'crypto';

export const SellerBatchParams = Type.Object({
  id: Type.Optional(Type.String()),
  seller: Type.String(),
  stamp: Type.String(),
});
export type SellerBatchParams = Static<typeof SellerBatchParams>;

export class SellerBatch implements SellerBatchParams {
  readonly id: string;
  readonly seller: string;
  readonly stamp: string;
  
  constructor(params: SellerBatchParams) {
    this.id = params.id || this.generateId(params.seller, params.stamp);
    this.seller = params.seller;
    this.stamp = params.stamp;
  }

  generateId(seller: string, stamp: string) {
    return crypto.createHash('md5').update(`${seller}${stamp}`).digest('hex');
  }
}