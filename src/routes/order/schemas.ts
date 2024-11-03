import { Type } from '@sinclair/typebox';
import { OrderRequestParams } from '../../controllers/order/OrderRequest';
import { OrderParams } from '../../controllers/order/Order';

export const createOrderSchema = {
  schema: {
    body: OrderRequestParams,
    response: {
      200: OrderParams,
    }
  }
}

export const getOrderSchema = {
  schema: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: OrderParams,
      404: {
        description: 'Order not found',
        type: 'null'
      }
    },
    
  }
}
