import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { CustomerCollectionInterface } from "../collection/customer.collection.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";



export interface FindAllCustomerServiceInterface {
  run(
    pagination: PageOptionsDto,
    search?: string,
    company_id?: string,
  ): Promise<PageMetaDto<CustomerCollectionInterface>>;
}
