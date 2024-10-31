import crypto from 'crypto';
import { Type, Static } from '@sinclair/typebox';

export const ProductParams = Type.Object({
  id: Type.Optional(Type.String()),
  seller: Type.String(), // FIXME: probably should be sellerId 
  sourceId: Type.String(),
  category: Type.String(),
  threadSize: Type.String(),
  finish: Type.String(),
  quantity: Type.Number(),
  price: Type.Number(),
});
export type ProductParams = Static<typeof ProductParams>;

export class Product implements ProductParams {
  readonly id: string;
  readonly seller: string;
  readonly sourceId: string;
  readonly category: string;
  readonly threadSize: string;
  readonly finish: string;
  readonly quantity: number;
  readonly price: number;

  generateId(seller: string, sourceId: string) {
    return crypto.createHash('md5').update(`${seller}${sourceId}`).digest('hex');
  }
  
  constructor(params: ProductParams) {
    this.id = params.id || this.generateId(params.seller, params.sourceId);
    this.seller = params.seller;
    this.sourceId = params.sourceId;
    this.category = params.category;
    this.threadSize = params.threadSize;
    this.finish = params.finish;
    this.quantity = params.quantity;
    this.price = params.price;
  }
}