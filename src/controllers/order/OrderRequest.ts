import { Type, Static } from '@sinclair/typebox';

export const ProductQuantities = Type.Record(
  Type.String(),
  Type.Integer(),
);

export type ProductQuantities = Static<typeof ProductQuantities>;

export const OrderRequestParams = Type.Object({
  productQuantities: ProductQuantities,
});
export type OrderRequestParams = Static<typeof OrderRequestParams>;

export class OrderRequest implements OrderRequestParams {
  readonly productQuantities: ProductQuantities;
  
  constructor(params: OrderRequestParams) {
    this.productQuantities = params.productQuantities;
  }
}