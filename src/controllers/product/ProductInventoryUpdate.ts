import { Type, Static } from '@sinclair/typebox';

export const ProductInventoryUpdateParams = Type.Object({
  productId: Type.String(),
  quantity: Type.Integer(),
});
export type ProductInventoryUpdateParams = Static<typeof ProductInventoryUpdateParams>;

export class ProductInventoryUpdate implements ProductInventoryUpdateParams {
  readonly productId: string;
  readonly quantity: number;
  
  constructor(params: ProductInventoryUpdateParams) {
    this.productId = params.productId;
    this.quantity = params.quantity;
  }
}