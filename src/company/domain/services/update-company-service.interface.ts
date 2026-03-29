import type { CompanyCollectionInterface } from "../collection/company.collection.interface";
import type { UpdateCompanyDto } from "../dto/update-company.dto";

export interface UpdateCompanyServiceInterface {
  run(
    id: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyCollectionInterface | null>;
}
