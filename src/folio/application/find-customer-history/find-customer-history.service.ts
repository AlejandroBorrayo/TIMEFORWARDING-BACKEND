import type { FindCustomerHistoryInterface } from "../../domain/services/find-customer-history-service.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class FindCustomerHistoryService implements FindCustomerHistoryInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(customerId: string): Promise<any> {
    try {
      return await this.FolioRepository.findCustomerHistory(customerId);
    } catch (err) {
      console.error("[FindCustomerHistoryService][run]", err);
      throw err;
    }
  }
}
