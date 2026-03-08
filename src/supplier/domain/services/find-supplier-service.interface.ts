import { SupplierCollectionInterface } from "../collection/supplier.collection.interface";



export interface FindSupplierServiceInterface {
  run(
    _id:string
  ): Promise<SupplierCollectionInterface | null>;
}
