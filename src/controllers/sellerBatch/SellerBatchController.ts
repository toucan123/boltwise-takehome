import { SellerBatch, SellerBatchParams } from './SellerBatch';
import { sellerBatchConnector } from '../../db/connectors/SellerBatchConnector';

export class SellerBatchController {
  async getBySeller(seller: string): Promise<SellerBatch | undefined> {
    const sellerBatch = await sellerBatchConnector.getBySeller(seller);
    return sellerBatch ? new SellerBatch(sellerBatch) : undefined;
  }
  
  async saveSellerBatch(sellerBatch: SellerBatchParams): Promise<SellerBatch | undefined> {
    await sellerBatchConnector.saveSellerBatch(sellerBatch);
    return sellerBatch;
  }
}

export const sellerBatchController = new SellerBatchController();
