import type { CustomerCollectionInterface } from "../../domain/collection/customer.collection.interface";
import type { FindAllCustomerServiceInterface } from "../../domain/services/find-all-customer-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import type { CustomerRepositoryInterface } from "../../domain/repositories/customer-repository.interface";

export class FindAllCustomerService implements FindAllCustomerServiceInterface {
  private addressRepository: CustomerRepositoryInterface;

  constructor(
    addressRepository: CustomerRepositoryInterface
  ) {
    this.addressRepository = addressRepository;
  }

  async run(
    pagination: PageOptionsDto,
    search?: string,
    company_id?: string,
  ): Promise<PageMetaDto<CustomerCollectionInterface>> {
    try {
      const [entities, total] = await this.addressRepository.findAll(
        pagination,
        search,
        company_id,
      );

      return new PageMetaDto<CustomerCollectionInterface>({
        total,
        pageOptions: pagination,
        records: entities,
      });
    } catch (err) {
      console.error("[FindAllCustomerService][run]", err);
      throw err;
    }
  }
}
