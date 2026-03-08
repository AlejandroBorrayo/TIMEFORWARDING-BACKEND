import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { CustomerCollectionInterface } from "../collection/customer.collection.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";



export interface FindCustomerServiceInterface {
  run(
    _id:string
  ): Promise<CustomerCollectionInterface | null>;
}
