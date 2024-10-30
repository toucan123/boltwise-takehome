import { SellerProductInitializer } from '../SellerProductInitializer';

export const productInitializer = new SellerProductInitializer({
  sellerName: 'seller-b',
  parser: () => {
    return [];
  }
});