import { Type } from '@sinclair/typebox';
import { SearchProductsParams } from '../../controllers';
import { ProductParams } from '../../controllers/types/Product';

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