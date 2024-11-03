import { Type } from '@sinclair/typebox';
import { SearchProductsParams } from '../../controllers/product/ProductController';
import { ProductParams } from '../../controllers/product/Product';

export const getProductByIdSchema = {
  schema: {
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

export const updateProductSchema = {
  schema: {
    body: ProductParams,
    response: {
      200: ProductParams
    }
  }
}

export const searchProductsSchema = {
  schema: {
    body: SearchProductsParams,
    response: {
      200: Type.Object({
        results: Type.Array(ProductParams),
      })
    }
  }
}