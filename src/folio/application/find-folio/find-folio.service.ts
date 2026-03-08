import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { FindFolioServiceInterface } from "../../domain/services/find-folio-service.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class FindFolioService implements FindFolioServiceInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(folio:string): Promise<FolioCollectionInterface | null> {
    try {
      return await this.FolioRepository.findOne(folio);

    } catch (err) {
      console.error("[FindFolioService][run]", err);
      throw err;
    }
  }
}
