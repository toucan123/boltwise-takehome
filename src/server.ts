import Fastify from 'fastify';
import { routes as productRoutes } from './routes/product/products';
import { routes as orderRoutes } from './routes/order/orders';
import { initSellers } from './sellers/initSellers';
import { initDb } from './db/postgresDb';
import { swaggerPlugin } from './middlewares/swagger';
import { ErrorCodes } from './utils/errors';

const PORT = 3131;

const app = Fastify();

app.register(swaggerPlugin);
app.register(productRoutes);
app.register(orderRoutes);

app.setErrorHandler((error, request, reply) => {
  console.log(JSON.stringify(error));
  reply.status(ErrorCodes.SERVER_ERROR).send(error.message);
});

async function start() {
  app.ready();
  app.listen({ port: PORT, host: '0.0.0.0' });

  await initDb();
  await initSellers();
  
  console.log(`listening on ${PORT}`);
};

start();
