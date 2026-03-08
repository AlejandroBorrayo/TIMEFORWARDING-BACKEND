import { TaxCollectionInterface } from "../collection/tax.collection.interface";

export interface TaxServiceInterface {
  run(payload:{name:string,amount:number}): Promise <TaxCollectionInterface>;
}
