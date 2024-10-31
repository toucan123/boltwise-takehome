import { Type, Static } from '@sinclair/typebox';
import { TypeboxValidator } from '../../utils/TypeboxValidator';
import { SellerProductInitializer } from '../SellerProductInitializer';
import { Product } from '../../controllers/types/Product';

const SourceProduct = Type.Object({
  product_id: Type.String(),
  description: Type.String(),
  thread_size: Type.String(),
  material: Type.String(),
  finish: Type.String(),
  quantity: Type.String(),
  price: Type.String(),
  category: Type.String()
});
type SourceProduct = Static<typeof SourceProduct>;

const sourceProductValidator = new TypeboxValidator(Type.Array(SourceProduct));

const SELLER = 'seller-a';

export const productInitializer = new SellerProductInitializer({
  sellerName: SELLER,
  validator: sourceProductValidator,
  parser: (sourceProducts: SourceProduct[]): Product[] => {
    return sourceProducts.map(p => new Product({
      seller: SELLER,
      sourceId: p.product_id,
      category: p.category,
      threadSize: p.thread_size,
      finish: p.finish,
      quantity: parseFloat(p.quantity),
      price: parseFloat(p.price),
    }));
  }
});