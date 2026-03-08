import type { SupplierCollectionInterface } from '../collection/supplier.collection.interface';


export interface UpdateSupplierServiceInterface {
  run(
    _id:string,
    payload: SupplierCollectionInterface,
  ): Promise<SupplierCollectionInterface | null>;
}
