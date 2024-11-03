import { Type, Static } from '@sinclair/typebox';
import { createClient } from 'redis';
import { Order, OrderParams } from '../controllers/order/Order';
import { OrderController } from '../controllers/order/OrderController';
import { ProductController } from '../controllers/product/ProductController';
import { ProductInventoryUpdateParams } from '../controllers/product/ProductInventoryUpdate';
import { TypeboxValidator } from '../utils/TypeboxValidator';

const client = createClient({
  url: `redis://${process.env.QUEUE_HOSTAME}:6379`
});

client.on('ready', (err) => {
  console.log(`Connecting to redis...`);
});

client.on('error', (err) => {
  console.log(`Redis error ${JSON.stringify(err)}`)
});

client.connect();

export enum QueueItemTypes {
  ORDER = 'order',
  INVENTORY_UPDATE = 'inventory-update'
};

export const OrderQueueItem = Type.Object({
  type: Type.Literal(QueueItemTypes.ORDER),
  item: OrderParams,
});
type OrderQueueItem = Static<typeof OrderQueueItem>;

export const InventoryUpdateQueueItem = Type.Object({
  type: Type.Literal(QueueItemTypes.INVENTORY_UPDATE),
  item: ProductInventoryUpdateParams,
});
type InventoryUpdateQueueItem = Static<typeof InventoryUpdateQueueItem>;

export const QueueItem = Type.Union([
  OrderQueueItem,
  InventoryUpdateQueueItem,
]);
type QueueItem = Static<typeof QueueItem>;

const queueItemValidator = new TypeboxValidator(QueueItem);

const QUEUE_KEY = 'product-queue';
const LOCK_TIMEOUT_MILLS = 2000;
const LOCK_KEY = `${QUEUE_KEY}::lock`;

export class QueueController {
  private async acquireLock(): Promise<boolean> {
    const result = await client.set(
      LOCK_KEY, 
      "1", 
      {
        NX: true,
        PX: LOCK_TIMEOUT_MILLS
      }
    );
    return result === "OK";
  }
  
  private async releaseLock(): Promise<void> {
    await client.del(LOCK_KEY);
  }
 
  private async process(){
    const hasLock = await this.acquireLock();
    if (!hasLock) {
      return;
    }
    try {
      const data = await client.zPopMax(QUEUE_KEY);
      if (data) {
        const item = queueItemValidator.validate(JSON.parse(data.value));
        console.log(`+++++++ Processing ${item.type} ++++++`);
        if (item.type === QueueItemTypes.INVENTORY_UPDATE) {
          await ProductController.processProductInventoryUpdate(item.item);
        } else if (item.type === QueueItemTypes.ORDER) {
          await OrderController.processOrder(new Order(item.item));
        }
      }
    } finally {
      await this.releaseLock();
    }
  }

  async enqueueOrder(orderParams: OrderParams) {
    return this.enqueue({
      type: QueueItemTypes.ORDER,
      item: orderParams,
    });
  }

  async enqueueInventoryUpdate(inventoryUpdate: ProductInventoryUpdateParams) {
    return this.enqueue({
      type: QueueItemTypes.INVENTORY_UPDATE,
      item: inventoryUpdate,
    });
  }

  async enqueue(item: QueueItem) {
    const score = item.type === QueueItemTypes.INVENTORY_UPDATE ? 1 : 0;
    const value = JSON.stringify(item);
    await client.zAdd(QUEUE_KEY, { score, value });
  }

  async run() {
    while(true) {
      await this.process();
    }
  }
}

export const queueController = new QueueController();

queueController.run();