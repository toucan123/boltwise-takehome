import { Type, Static } from '@sinclair/typebox';
import { ProductRow } from '../../db/connectors/product/productRow';

export const ProductParams = Type.Object({
  id: Type.String(),
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
  readonly sourceId: string;
  readonly category: string;
  readonly threadSize: string;
  readonly finish: string;
  readonly quantity: number;
  readonly price: number;
  
  constructor(params: ProductParams) {
    this.id = params.id;
    this.sourceId = params.sourceId;
    this.category = params.category;
    this.threadSize = params.threadSize;
    this.finish = params.finish;
    this.quantity = params.quantity;
    this.price = params.price;
  }

  static fromRow(params: ProductRow): Product {
    return new Product({
      id: params.id,
      sourceId: params.source_id,
      category: params.category,
      threadSize: params.thread_size,
      finish: params.finish,
      quantity: params.quantity,
      price: params.price,
    })
  }

  toRow(): ProductRow {
    return {
      id: this.id,
      source_id: this.sourceId,
      category: this.category,
      thread_size: this.threadSize,
      finish: this.finish,
      quantity: this.quantity,
      price: this.price,
    }
  }
}