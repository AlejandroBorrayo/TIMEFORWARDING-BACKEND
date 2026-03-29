import type { CompanyCollectionInterface } from "../collection/company.collection.interface";

export interface FindCompanyServiceInterface {
  run(id: string): Promise<CompanyCollectionInterface | null>;
}
