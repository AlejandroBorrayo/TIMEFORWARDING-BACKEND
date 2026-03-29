import type { CompanyCollectionInterface } from "../collection/company.collection.interface";
import type { CreateCompanyDto } from "../dto/create-company.dto";

export interface CreateCompanyServiceInterface {
  run(dto: CreateCompanyDto): Promise<CompanyCollectionInterface>;
}
