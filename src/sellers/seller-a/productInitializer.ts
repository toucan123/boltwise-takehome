import { SellerProductInitializer } from '../SellerProductInitializer';

export const productInitializer = new SellerProductInitializer({
  sellerName: 'seller-a',
  parser: () => {
    return [];
  }
});