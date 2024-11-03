import { randomUUID } from 'crypto';
import { Type, Static } from '@sinclair/typebox';
import { OrderRequestParams, ProductQuantities } from './OrderRequest';

export enum OrderStatuses {
  PENDING = 'pending',
  INITIATED = 'initiated',
  FAILED = 'failed',
  EXPIRED = 'expired',
  COMPLETE = 'complete'
};

export const OrderParams = Type.Object({
  id: Type.Optional(Type.String()),
  status: Type.Enum(OrderStatuses),
  productQuantities: ProductQuantities,
  failureMessages: Type.Array(Type.String())
});
export type OrderParams = Static<typeof OrderParams>;

export class Order implements OrderParams {
  readonly id: string;
  readonly productQuantities: ProductQuantities;
  readonly failureMessages: string[];
  status: OrderStatuses;
  
  constructor(params: OrderParams) {
    this.id = params.id || randomUUID();
    this.status = params.status;
    this.productQuantities = params.productQuantities;
    this.failureMessages = params.failureMessages;
  }

  clone() {
    return new Order(JSON.parse(JSON.stringify(this)));
  }

  static fromOrderRequest(orderRequestParams: OrderRequestParams) {
    return new Order({
      status: OrderStatuses.PENDING,
      productQuantities: orderRequestParams.productQuantities,
      failureMessages: [],
    });
  }

  addFailureMessage(message: string) {
    this.failureMessages.push(message);
  }
}