import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { FindAllFolioServiceInterface } from "../../domain/services/find-all-folio-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class FindAllFolioService implements FindAllFolioServiceInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(data: {
    pagination: { page: number; perpage: number };
    folio?: string;
    no_quote?: number;
    seller_name?: string;
    customer?: string;
    seller_userid?: string;
    company_id?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    supplier?: string;
  }): Promise<PageMetaDto<FolioCollectionInterface>> {
    try {
      const [entities, total] = await this.FolioRepository.findAll(data);

      return new PageMetaDto<FolioCollectionInterface>({
        total,
        pageOptions: data?.pagination,
        records: entities,
      });
    } catch (err) {
      console.error("[FindAllFolioService][run]", err);
      throw err;
    }
  }
}
