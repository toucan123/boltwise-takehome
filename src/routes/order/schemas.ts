import { Type } from '@sinclair/typebox';
import { OrderRequestParams } from '../../controllers/order/OrderRequest';
import { OrderParams } from '../../controllers/order/Order';

const TAG = 'Orders';

export const createOrderSchema = {
  schema: {
    tags: [TAG],
    body: OrderRequestParams,
    response: {
      200: OrderParams,
    }
  }
}

export const getOrderSchema = {
  schema: {
    tags: [TAG],
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
