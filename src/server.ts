import Fastify from 'fastify';
import { routes } from './routes/products';
import { initSellers } from './sellers/initSellers';
import { initDb } from './db/postgresDb';
import { swaggerPlugin } from './middlewares/swagger';

const PORT = 3131;

const app = Fastify();
app.register(swaggerPlugin);
app.register(routes);

async function start() {
  app.ready();
  app.listen({ port: PORT, host: '0.0.0.0' });

  await initDb();
  await initSellers();
  
  console.log(`listening on ${PORT}`);
};

start();
