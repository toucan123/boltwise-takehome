import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { productController } from '../controllers';
import { getProductByIdSchema, searchProductsSchema } from './schemas';

export const routes = async (fastifyInstance: FastifyInstance) => {
  const router = fastifyInstance
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler);

  router.post('/products/search', searchProductsSchema, async (req, res) => {
    const products = await productController.getProducts(req.body);
    res.send({ results: products });
  });

  router.get('/products/:id', getProductByIdSchema, async (req, res) => {
    const product = await productController.getProductById(req.params.id);
    res.send(product);
  });
}