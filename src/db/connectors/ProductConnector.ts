import { Type, Static } from '@sinclair/typebox';
import { db, pgp } from '../postgresDb';
import { SearchProductsParams } from '../../controllers/product/ProductController';
import { ProductParams } from '../../controllers/product/Product';
import { TypeboxValidator } from '../../utils/TypeboxValidator';

export const ProductRow = Type.Object({
  id: Type.String(),
  batch: Type.Union([Type.String(), Type.Null()]),
  available: Type.Boolean(),
  properties: ProductParams,
});
export type ProductRow = Static<typeof ProductRow>;

export const productRowValidator = new TypeboxValidator(ProductRow);

export class ProductConnector {
  async getProductById(id: string): Promise<ProductRow | undefined> {
    const query = 'SELECT * FROM products WHERE id = $(id)';
    const product = await db.oneOrNone(query, { id });
    return product ? productRowValidator.validate(product) : undefined;
  }

  async getProducts(params: SearchProductsParams): Promise<ProductRow[]> {
    const filters: string[] = ['available = TRUE'];
    const values: any = {};
    if (params.sellers) {
      filters.push(`properties->>'sellers' IN ($(sellers:csv))`);
      values.sellers = params.sellers;
    }
    if (params.categories) {
      filters.push(`properties->>'category' IN ($(categories:csv))`);
      values.categories = params.categories;
    }
    if (params.finishes) {
      filters.push(`properties->>'finish' IN ($(finishes:csv))`);
      values.finishes = params.finishes;
    }
    if (params.threadSizes) {
      filters.push(`properties->>'threadSize' IN ($(threadSizes:csv))`);
      values.threadSizes = params.threadSizes;
    }
    if (params.priceLow) {
      filters.push(`(properties->>'price')::NUMERIC >= $(priceLow)`);
      values.priceLow = params.priceLow;
    }
    if (params.priceHigh) {
      filters.push(`(properties->>'price')::NUMERIC <= $(priceHigh)`);
      values.priceHigh = params.priceHigh;
    }

    const whereClause = `WHERE ${filters.join(' AND ')}`;
    const query = `SELECT * FROM products ${whereClause}`;
    const products = await db.manyOrNone(query, values);
    return products.map(p => productRowValidator.validate(p));
  }

  async saveProducts(products: ProductRow[]): Promise<void> {
    const insertColumnSet = new pgp.helpers.ColumnSet(
      ['id', 'properties', 'available', 'batch'],
      { table: 'products' }
    );
    const insertQuery = pgp.helpers.insert(products, insertColumnSet);
    const insertQueryWithUpdate = `${insertQuery}
      ON CONFLICT (id) DO UPDATE
      SET properties = EXCLUDED.properties,
          available = EXCLUDED.available,
          batch = EXCLUDED.batch`;
    await db.none(insertQueryWithUpdate);
  }

  async updateProduct(product: Omit<ProductRow, 'available' | 'batch'>): Promise<void> {
    const updateQuery = `UPDATE products SET
      properties = $(properties)
      WHERE id = $(id)`;
    await db.none(updateQuery, product);
  }

  async expireOldProducts(latestBatch: string): Promise<void> {
    const query = `UPDATE products 
      SET available = FALSE
      WHERE batch != $(batch)`;
    await db.none(query, { batch: latestBatch });
  }
}

export const productConnector = new ProductConnector();