import type { CustomerCollectionInterface } from "../../domain/collection/customer.collection.interface";
import type { FindCustomerServiceInterface } from "../../domain/services/find-customer-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import type { CustomerRepositoryInterface } from "../../domain/repositories/customer-repository.interface";

export class FindCustomerService implements FindCustomerServiceInterface {
  private customerRepository: CustomerRepositoryInterface;

  constructor(
    customerRepository: CustomerRepositoryInterface
  ) {
    this.customerRepository = customerRepository;
  }

  async run(
    _id:string
  ): Promise<CustomerCollectionInterface | null> {
    try {
      return await this.customerRepository.findOne(_id);


    } catch (err) {
      console.error("[FindCustomerService][run]", err);
      throw err;
    }
  }
}
