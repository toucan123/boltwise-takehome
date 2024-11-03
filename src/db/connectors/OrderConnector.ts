import { Type, Static } from '@sinclair/typebox';
import { db, pgp } from '../postgresDb';
import { OrderParams } from '../../controllers/order/Order';
import { TypeboxValidator } from '../../utils/TypeboxValidator';

export const OrderRow = Type.Object({
  id: Type.String(),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.String(),
  properties: OrderParams,
});
export type OrderRow = Static<typeof OrderRow>;

export const orderRowValidator = new TypeboxValidator(OrderRow);

export class OrderConnector {
  async getOrderById(id: string): Promise<OrderRow | undefined> {
    const query = `SELECT *, created_at::TEXT, updated_at::TEXT 
      FROM orders WHERE id = $(id)`;
    const order = await db.oneOrNone(query, { id });
    return order ? orderRowValidator.validate(order) : undefined;
  }

  async saveOrder(order: OrderRow): Promise<void> {
    const columnSet = new pgp.helpers.ColumnSet(
      ['id', 'created_at', 'updated_at', 'properties'],
      { table: 'orders' }
    );
    const insertQuery = pgp.helpers.insert(order, columnSet);
    const insertQueryWithUpdate = `${insertQuery}
      ON CONFLICT (id) DO UPDATE
      SET properties = EXCLUDED.properties`;
    await db.none(insertQueryWithUpdate);
  }

  async updateOrder(order: OrderRow): Promise<void> {
    const updateQuery = `UPDATE orders SET
      properties = $(properties),
      updated_at = $(updated_at)
      WHERE id = $(id)`;
    await db.none(updateQuery, order);
  }
}

export const orderConnector = new OrderConnector();