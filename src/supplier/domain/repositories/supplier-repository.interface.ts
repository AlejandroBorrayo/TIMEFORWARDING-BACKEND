import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { SupplierCollectionInterface } from "../collection/supplier.collection.interface";
import { SupplierDto } from "../../domain/dto/supplier.dto";


export interface SupplierRepositoryInterface {
  create(user: SupplierDto): Promise<SupplierCollectionInterface>;
  findAll(
    pageOptions: PageOptionsDto,
    search?: string,
    company_id?: string,
  ): Promise<[SupplierCollectionInterface[], number]>;
  findOne(_id?: string): Promise<SupplierCollectionInterface | null>;
  
  updatePartial(
    existingUser: SupplierCollectionInterface,
    user: Partial<SupplierCollectionInterface>
  ): Promise<SupplierCollectionInterface>;
}
