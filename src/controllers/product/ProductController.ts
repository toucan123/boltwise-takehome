import { Type, Static } from '@sinclair/typebox';
import { productConnector, ProductRow } from '../../db/connectors/ProductConnector';
import { Product } from './Product';
import { ProductInventoryUpdate } from './ProductInventoryUpdate';
import { queueController } from '../../queue/QueueController';
import { SellerBatch } from '../sellerBatch/SellerBatch';

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

  async saveProductsBatch(products: Product[], sellerBatch: SellerBatch) {
    const productRows: ProductRow[] = products.map(p => ({
      id: p.id,
      seller: p.seller,
      properties: p,
      available: true,
      batch: sellerBatch.id
    }));
    await productConnector.saveProducts(productRows);
    await productConnector.expireOldProducts(sellerBatch.seller, sellerBatch.id);
  }

  async createProductInventoryUpdate(productInventoryUpdate: ProductInventoryUpdate) {
    await queueController.enqueueInventoryUpdate(productInventoryUpdate);
  }

  static async processProductInventoryUpdate(productInventoryUpdate: ProductInventoryUpdate) {
    const { productId, quantity } = productInventoryUpdate;
    const product = await productConnector.getProductById(productId);
    if (product) {
      product.properties.quantity = Math.max(0, product.properties.quantity + quantity);
      await productConnector.updateProduct({
        id: product.id,
        properties: product.properties
      });
    }
  }
}

export const productController = new ProductController();
