import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { productController } from '../../controllers/product/ProductController';
import { updateProductSchema, getProductByIdSchema, searchProductsSchema } from './schemas';
import { Product } from '../../controllers/product/Product';
import { ErrorCodes } from '../../utils/errors';

export const routes = async (fastifyInstance: FastifyInstance) => {
  const router = fastifyInstance
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler);

  router.post('/products/search', searchProductsSchema, async (req, res) => {
    const products = await productController.getProducts(req.body);
    res.send({ results: products });
  });

  router.put('/products/:id', updateProductSchema, async (req, res) => {
    const product = new Product(req.body);
    const products = await productController.updateProducts([product]);
    res.send(products[0]);
  });

  router.get('/products/:id', getProductByIdSchema, async (req, res) => {
    const product = await productController.getProductById(req.params.id);
    if (!product) {
      res.status(ErrorCodes.NOT_FOUND).send('Product Not Found');
    } else {
      res.send(product);
    }
  });
}