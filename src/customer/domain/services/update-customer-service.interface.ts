import type { CustomerCollectionInterface } from '../collection/customer.collection.interface';


export interface UpdateCustomerServiceInterface {
  run(
    _id:string,
    payload: CustomerCollectionInterface,
  ): Promise<CustomerCollectionInterface | null>;
}
