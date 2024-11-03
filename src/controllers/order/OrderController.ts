import { Order, OrderStatuses } from './Order';
import { OrderRequestParams } from './OrderRequest';
import { Product } from '../product/Product';
import { queueController } from '../../redis/QueueController';
import { productController } from '../product/ProductController';
import { orderConnector } from '../../db/connectors/OrderConnector';

export class OrderController {
  async getOrderById(id: string): Promise<Order | undefined> {
    const order = await orderConnector.getOrderById(id);
    return order ? new Order(order.properties) : undefined;
  } 

  async createOrder(orderRequestParams: OrderRequestParams): Promise<Order> {
    const order = Order.fromOrderRequest(orderRequestParams);
    await orderConnector.saveOrder({
      id: order.id,
      properties: order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    await queueController.enqueueOrder(order);
    return order;
  }

  static async processOrder(order: Order) {
    const updatedOrder = order.clone();
    const productIds = Object.keys(order.productQuantities);

    const products = (await Promise.all(productIds.map(
      id => productController.getProductById(id))
    )).filter((p) : p is Product => !!p);

    if (products.length !== productIds.length) {
      const missingProductIds = productIds.filter(id => !products.find(p => p.id === id));
      updatedOrder.status = OrderStatuses.FAILED;
      updatedOrder.addFailureMessage(`Requested invalid inventory items: ${missingProductIds.join(', ')}`);
    }

    for (const product of products) {
      const soughtQuantity = order.productQuantities[product.id];
      if ((product.quantity - soughtQuantity) < 0) {
        updatedOrder.status = OrderStatuses.FAILED;
        updatedOrder.addFailureMessage(`Insufficient inventory for ${product.id}`);
      } else {
        product.subtractQuantity(soughtQuantity);
      }
    }

    if (updatedOrder.status !== OrderStatuses.FAILED) {
      updatedOrder.status = OrderStatuses.INITIATED;
      await productController.updateProducts(products);
    }

    await orderConnector.updateOrder({
      id: updatedOrder.id,
      properties: updatedOrder,
      updated_at: new Date().toISOString(),
    });
  }
}

export const orderController = new OrderController();
