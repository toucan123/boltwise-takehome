import { Type } from '@sinclair/typebox';
import { SearchProductsParams } from '../../controllers/product/ProductController';
import { ProductParams } from '../../controllers/product/Product';

const TAG = 'Products';

export const getProductByIdSchema = {
  schema: {
    tags: [TAG],
    params: Type.Object({ id: Type.String() }),
    response: {
      200: ProductParams,
      404: {
        description: 'Product not found',
        type: 'null'
      }
    }
  }
}

export const updateInventoryProductSchema = {
  schema: {
    tags: [TAG],
    params: Type.Object({ id: Type.String() }),
    body: Type.Object({ quantity: Type.Number() }),
    response: {
      200: ProductParams
    }
  }
}

export const searchProductsSchema = {
  schema: {
    tags: [TAG],
    body: SearchProductsParams,
    response: {
      200: Type.Object({
        results: Type.Array(ProductParams),
      })
    }
  }
}