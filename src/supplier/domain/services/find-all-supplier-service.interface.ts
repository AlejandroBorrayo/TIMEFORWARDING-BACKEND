import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { SupplierCollectionInterface } from "../collection/supplier.collection.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";



export interface FindAllSupplierServiceInterface {
  run(
    pagination: PageOptionsDto,
    search?: string
  ): Promise<PageMetaDto<SupplierCollectionInterface>>;
}
