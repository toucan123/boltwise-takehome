import { Type, Static } from '@sinclair/typebox';
import { productConnector } from '../db/connectors/product/ProductConnector';
import { Product } from '../controllers/types/Product';

export const SearchProductsParams = Type.Object({
  categories: Type.Optional(Type.String()),
  threadSize: Type.Optional(Type.String()),
  finish: Type.Optional(Type.String()),
  priceLow: Type.Optional(Type.Number()),
  priceHigh: Type.Optional(Type.Number()),
});
export type SearchProductsParams = Static<typeof SearchProductsParams>;

export class ProductController {
  async getProductById(id: string): Promise<Product | undefined> {
    const product = await productConnector.getProductById(id);
    return product ? Product.fromRow(product) : undefined;
  }
  
  async getProducts(params: SearchProductsParams): Promise<Product[]> {
    const products = await productConnector.getProducts(params);
    return products?.map(p => Product.fromRow(p)); 
  }

  async addProducts(products: Product[]) {
    const productRows = products.map(p => p.toRow());
    const results = await productConnector.saveProducts(productRows);
  }
}

export const productController = new ProductController();
