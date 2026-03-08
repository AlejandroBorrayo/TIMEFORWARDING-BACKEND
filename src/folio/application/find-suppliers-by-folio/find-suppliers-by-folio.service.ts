import type { FindSuppliersByFolioServiceInterface } from "../../domain/services/find-suppliers-by-folio-service.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class FindSuppliersByFolioService implements FindSuppliersByFolioServiceInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(folio:string): Promise<any | null> {
    try {
      return await this.FolioRepository.findSuppliersByFolio(folio);

    } catch (err) {
      console.error("[FindFolioService][run]", err);
      throw err;
    }
  }
}
