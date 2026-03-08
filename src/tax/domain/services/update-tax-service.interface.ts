import type { TaxCollectionInterface } from '../collection/tax.collection.interface';


export interface UpdateTaxServiceInterface {
  run(
    _id:string,
    note: TaxCollectionInterface,
  ): Promise<TaxCollectionInterface | null>;
}
