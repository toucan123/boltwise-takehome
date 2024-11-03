import crypto from 'crypto';
import { Type, Static } from '@sinclair/typebox';

export const ProductParams = Type.Object({
  id: Type.Optional(Type.String()),
  seller: Type.String(),
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
  readonly price: number;
  quantity: number;
  
  constructor(params: ProductParams) {
    this.id = params.id || this.generateId(params.seller, params.sourceId);
    this.seller = params.seller;
    this.sourceId = params.sourceId;
    this.category = params.category;
    this.threadSize = params.threadSize;
    this.finish = params.finish;
    this.price = params.price;
    this.quantity = params.quantity;
  }

  generateId(seller: string, sourceId: string) {
    return crypto.createHash('md5').update(`${seller}${sourceId}`).digest('hex');
  }

  subtractQuantity(quantity: number) {
    this.quantity = Math.max(0, this.quantity - quantity);
  }

  addQuantity(quantity: number) {
    this.quantity += quantity;
  }

  toJSON() {
    return {
      id: this.id,
      seller:  this.seller,
      sourceId: this.sourceId,
      category: this.category,
      threadSize: this.threadSize,
      finish: this.finish,
      price: this.price,
      quantity: this.quantity,
    }
  }
}