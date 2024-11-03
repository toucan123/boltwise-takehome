import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { orderController } from '../../controllers/order/OrderController';
import { createOrderSchema, getOrderSchema } from './schemas';
import { ErrorCodes } from '../../utils/errors';

export const routes = async (fastifyInstance: FastifyInstance) => {
  const router = fastifyInstance
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler);

  router.post('/orders', createOrderSchema, async (req, res) => {
    const order = await orderController.createOrder(req.body);
    res.send(order);
  });

  router.get('/orders/:id', getOrderSchema, async (req, res) => {
    const order = await orderController.getOrderById(req.params.id);
    if (!order) {
      res.status(ErrorCodes.NOT_FOUND).send('Order not found');
    } else {
      res.send(order);
    }
  });
}