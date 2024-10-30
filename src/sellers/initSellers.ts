import { productInitializer as sellerAInitializer} from './seller-a/productInitializer';
import { productInitializer as sellerBInitializer} from './seller-b/productInitializer';
import { SellerProductInitializer } from './SellerProductInitializer';

const sellers: SellerProductInitializer[] = [
  sellerAInitializer,
  sellerBInitializer,
];

export const initSellers = async () =>  {
  Promise.all(sellers.map(seller => seller.run()));
}
