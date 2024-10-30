import { Type, Static } from '@sinclair/typebox';
import { TypeboxValidator } from '../../../utils/TypeboxValidator';

export const ProductRow = Type.Object({
  id: Type.String(),
  source_id: Type.String(),
  category: Type.String(),
  thread_size: Type.String(),
  finish: Type.String(),
  quantity: Type.Number(),
  price: Type.Number(),
});
export type ProductRow = Static<typeof ProductRow>;

export const productRowValidator = new TypeboxValidator(ProductRow);
