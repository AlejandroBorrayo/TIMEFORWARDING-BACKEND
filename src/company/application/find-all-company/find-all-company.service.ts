import type { FindAllCompanyServiceInterface } from "../../domain/services/find-all-company-service.interface";
import type { CompanyRepositoryInterface } from "../../domain/repositories/company-repository.interface";
import type { CompanyCollectionInterface } from "../../domain/collection/company.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";

export class FindAllCompanyService implements FindAllCompanyServiceInterface {
  constructor(private readonly companyRepository: CompanyRepositoryInterface) {}

  async run(
    pagination: PageOptionsDto,
    search?: string,
  ): Promise<PageMetaDto<CompanyCollectionInterface>> {
    const [entities, total] = await this.companyRepository.findAll(
      pagination,
      search,
    );
    return new PageMetaDto<CompanyCollectionInterface>({
      total,
      pageOptions: pagination,
      records: entities,
    });
  }
}
