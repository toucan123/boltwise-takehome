import { db } from '../../postgresDb';
import { SearchProductsParams } from '../../../controllers';
import { ProductRow, productRowValidator } from './productRow';

export class ProductConnector {
  async getProductById(id: string): Promise<ProductRow | undefined> {
    const product = await db.oneOrNone('SELECT * FROM products WHERE id = ${id}', { id });
    return product ? productRowValidator.validate(product) : undefined;
  }

  async getProducts(params: SearchProductsParams): Promise<ProductRow[]> {
    return [];
    // const products = await db.manyOrNone('SELECT * FROM products WHERE id = ${id}', { id });
    // return products.map(p => productRowValidator.validate(p));
  }

  async saveProducts(products: ProductRow[]): Promise<void> {
    // const products = await db.manyOrNone('SELECT * FROM products WHERE id = ${id}', { id });
    // return products.map(p => productRowValidator.validate(p));
  }
}

export const productConnector = new ProductConnector();