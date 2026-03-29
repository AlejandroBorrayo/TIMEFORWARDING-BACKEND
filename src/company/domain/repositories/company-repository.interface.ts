import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import type { CompanyCollectionInterface } from "../collection/company.collection.interface";

export interface CompanyRepositoryInterface {
  create(
    data: Partial<CompanyCollectionInterface>,
  ): Promise<CompanyCollectionInterface>;
  findAll(
    pageOptions: PageOptionsDto,
    search?: string,
  ): Promise<[CompanyCollectionInterface[], number]>;
  findOne(_id: string): Promise<CompanyCollectionInterface | null>;

  updatePartial(
    existing: CompanyCollectionInterface,
    data: Partial<CompanyCollectionInterface>,
  ): Promise<void>;
}
