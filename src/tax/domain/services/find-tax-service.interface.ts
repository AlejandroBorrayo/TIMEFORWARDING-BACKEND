import { TaxCollectionInterface } from "../collection/tax.collection.interface";



export interface FindTaxServiceInterface {
  run(
    _id:string
  ): Promise<TaxCollectionInterface | null>;
}
