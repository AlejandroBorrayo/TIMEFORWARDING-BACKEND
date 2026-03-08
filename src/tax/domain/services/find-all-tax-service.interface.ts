import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { TaxCollectionInterface } from "../collection/tax.collection.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";



export interface FindAllTaxServiceInterface {
  run(
    pagination: PageOptionsDto,
    search?: string
  ): Promise<PageMetaDto<TaxCollectionInterface>>;
}
