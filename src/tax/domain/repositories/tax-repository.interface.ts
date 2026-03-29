import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { TaxCollectionInterface } from "../collection/tax.collection.interface";

export interface TaxRepositoryInterface {
  create(tax: {
    name: string;
    amount: number;
    company_id: string;
  }): Promise<TaxCollectionInterface>;
  findAll(
    pageOptions: PageOptionsDto,
    company_id?: string,
  ): Promise<[TaxCollectionInterface[], number]>;
  findOne(_id?: string): Promise<TaxCollectionInterface | null>;

  updatePartial(
    existingnote: TaxCollectionInterface,
    tax: TaxCollectionInterface
  ): Promise<TaxCollectionInterface>;
}
