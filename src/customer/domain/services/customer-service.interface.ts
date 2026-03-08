import { CustomerCollectionInterface } from "../collection/customer.collection.interface";
import { CustomerDto } from "../../domain/dto/customer.dto";


export interface CustomerServiceInterface {
  run(customer: Partial<CustomerDto>, ): Promise<CustomerCollectionInterface>;
}
