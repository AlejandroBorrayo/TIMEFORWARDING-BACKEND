import { SupplierCollectionInterface } from "../collection/supplier.collection.interface";
import { SupplierDto } from "../../domain/dto/supplier.dto";


export interface SupplierServiceInterface {
  run(customer: Partial<SupplierDto>, ): Promise<SupplierCollectionInterface>;
}
