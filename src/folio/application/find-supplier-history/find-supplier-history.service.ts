import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { FindSupplierHistoryInterface } from "../../domain/services/find-supplier-history-service.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class FindSupplierHistoryService implements FindSupplierHistoryInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(supplierid:string): Promise<any> {
    try {
      return await this.FolioRepository.findSupplierHistory(supplierid);
    } catch (err) {
      console.error("[FindFolioService][run]", err);
      throw err;
    }
  }
}
