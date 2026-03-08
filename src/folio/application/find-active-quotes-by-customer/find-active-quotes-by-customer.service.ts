import type { FindActiveQuotesByCustomerServiceInterface } from "../../domain/services/find-active-quotes-by-customer-service.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class FindActiveQuotesByCustomerService
  implements FindActiveQuotesByCustomerServiceInterface
{
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(customerId: string, sellerId?: string): Promise<any[]> {
    try {
      return await this.FolioRepository.findActiveQuotesByCustomer(customerId, sellerId);
    } catch (err) {
      console.error("[FindActiveQuotesByCustomerService][run]", err);
      throw err;
    }
  }
}
