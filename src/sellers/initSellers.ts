import { productInitializer as sellerAInitializer} from './seller-a/productInitializer';
import { productInitializer as sellerBInitializer} from './seller-b/productInitializer';

const sellers = [
  sellerAInitializer,
  sellerBInitializer,
];

export const initSellers = async () =>  {
  Promise.all(sellers.map(seller => seller.run()));
}
