import type { CreateCompanyServiceInterface } from "../../domain/services/create-company-service.interface";
import type { CompanyRepositoryInterface } from "../../domain/repositories/company-repository.interface";
import type { CreateCompanyDto } from "../../domain/dto/create-company.dto";
import type { CompanyCollectionInterface } from "../../domain/collection/company.collection.interface";

export class CreateCompanyService implements CreateCompanyServiceInterface {
  constructor(private readonly companyRepository: CompanyRepositoryInterface) {}

  async run(dto: CreateCompanyDto): Promise<CompanyCollectionInterface> {
    return this.companyRepository.create({
      name: dto.name.trim(),
      logo: dto.logo,
    });
  }
}
