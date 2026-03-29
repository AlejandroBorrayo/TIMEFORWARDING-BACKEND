import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import type { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { CompanyCollectionInterface } from "../collection/company.collection.interface";

export interface FindAllCompanyServiceInterface {
  run(
    pagination: PageOptionsDto,
    search?: string,
  ): Promise<PageMetaDto<CompanyCollectionInterface>>;
}
