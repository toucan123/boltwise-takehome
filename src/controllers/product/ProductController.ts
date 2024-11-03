import { Type, Static } from '@sinclair/typebox';
import { productConnector } from '../../db/connectors/ProductConnector';
import { Product } from './Product';

export const SearchProductsParams = Type.Object({
  sellers: Type.Optional(Type.Array(Type.String())),
  categories: Type.Optional(Type.Array(Type.String())),
  threadSizes: Type.Optional(Type.Array(Type.String())),
  finishes: Type.Optional(Type.Array(Type.String())),
  priceLow: Type.Optional(Type.Number()),
  priceHigh: Type.Optional(Type.Number()),
});
export type SearchProductsParams = Static<typeof SearchProductsParams>;

export class ProductController {
  async getProductById(id: string): Promise<Product | undefined> {
    const product = await productConnector.getProductById(id);
    return product ? new Product(product.properties) : undefined;
  }
  
  async getProducts(params: SearchProductsParams): Promise<Product[]> {
    const products = await productConnector.getProducts(params);
    return products?.map(p => new Product(p.properties)); 
  }

  async updateProducts(products: Product[]): Promise<Product[]>{
    const productRows = products.map(p => ({
      id: p.id,
      properties: p
    }));
    await Promise.all(productRows.map(p => productConnector.updateProduct(p)));
    return products;
  }

  async saveProductsBatch(products: Product[], batch: string) {
    const productRows = products.map(p => ({
      id: p.id,
      properties: p,
      available: true,
      batch
    }));
    await productConnector.saveProducts(productRows);
    await productConnector.expireOldProducts(batch);
  }
}

export const productController = new ProductController();
