import { Type, Static } from '@sinclair/typebox';
import { TypeboxValidator } from '../../utils/TypeboxValidator';
import { SellerProductInitializer } from '../SellerProductInitializer';
import { Product } from '../../controllers/product/Product';

const SourceProduct = Type.Object({
  item_number: Type.String(),
  product_name: Type.String(),
  threading: Type.String(),
  composition: Type.String(),
  surface_treatment: Type.String(),
  stock: Type.String(),
  unit_cost: Type.String(),
  product_category: Type.String()
});
type SourceProduct = Static<typeof SourceProduct>;

const sourceProductValidator = new TypeboxValidator(Type.Array(SourceProduct));

const SELLER = 'seller-b';

export const productInitializer = new SellerProductInitializer({
  sellerName: SELLER,
  validator: sourceProductValidator,
  parser: (sourceProducts: SourceProduct[]): Product[] => {
    return sourceProducts.map(p => new Product({
      seller: SELLER,
      sourceId: p.item_number,
      category: p.product_category,
      threadSize: p.threading,
      finish: p.surface_treatment,
      quantity: parseFloat(p.stock),
      price: parseFloat(p.unit_cost),
    }));
  }
});