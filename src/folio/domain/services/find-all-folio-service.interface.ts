import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { FolioCollectionInterface } from "../collection/folio.collection.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";

export interface FindAllFolioServiceInterface {
  run(data: {
    pagination: { page: number; perpage: number };
    folio?: string;
    no_quote?: number;
    customer?: string;
    seller_userid?: string;
    company_id?: string;
    seller_name?: string;
    supplier?: string;
    start_date?: string | Date;
    end_date?: string | Date;
  }): Promise<PageMetaDto<FolioCollectionInterface>>;
}
