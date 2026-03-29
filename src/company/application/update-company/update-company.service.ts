import type { UpdateCompanyServiceInterface } from "../../domain/services/update-company-service.interface";
import type { CompanyRepositoryInterface } from "../../domain/repositories/company-repository.interface";
import type { UpdateCompanyDto } from "../../domain/dto/update-company.dto";
import type { CompanyCollectionInterface } from "../../domain/collection/company.collection.interface";

export class UpdateCompanyService implements UpdateCompanyServiceInterface {
  constructor(private readonly companyRepository: CompanyRepositoryInterface) {}

  async run(
    id: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyCollectionInterface | null> {
    const existing = await this.companyRepository.findOne(id);
    if (!existing) {
      const error: any = new Error("Company not found");
      error.status = 404;
      throw error;
    }

    const patch: Partial<CompanyCollectionInterface> = {};
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.logo !== undefined) patch.logo = dto.logo.trim();

    if (Object.keys(patch).length === 0) {
      return this.companyRepository.findOne(id);
    }

    await this.companyRepository.updatePartial(existing, patch);
    return this.companyRepository.findOne(id);
  }
}
