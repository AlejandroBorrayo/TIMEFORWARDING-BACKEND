import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { CustomerCollectionInterface } from "../collection/customer.collection.interface";
import { CustomerDto } from "../../domain/dto/customer.dto";


export interface CustomerRepositoryInterface {
  create(user: CustomerDto): Promise<CustomerCollectionInterface>;
  findAll(
    pageOptions: PageOptionsDto,
    search?: string,
  ): Promise<[CustomerCollectionInterface[], number]>;
  findOne(_id?: string): Promise<CustomerCollectionInterface | null>;
  
  updatePartial(
    existingUser: CustomerCollectionInterface,
    user: Partial<CustomerCollectionInterface>
  ): Promise<CustomerCollectionInterface>;
}
