import type { FindCompanyServiceInterface } from "../../domain/services/find-company-service.interface";
import type { CompanyRepositoryInterface } from "../../domain/repositories/company-repository.interface";
import type { CompanyCollectionInterface } from "../../domain/collection/company.collection.interface";

export class FindCompanyService implements FindCompanyServiceInterface {
  constructor(private readonly companyRepository: CompanyRepositoryInterface) {}

  async run(id: string): Promise<CompanyCollectionInterface | null> {
    return this.companyRepository.findOne(id);
  }
}
