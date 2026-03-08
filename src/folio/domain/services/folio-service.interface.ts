import { FolioCollectionInterface } from "../collection/folio.collection.interface";
import { FolioDto } from "../dto/folio.dto";


export interface FolioServiceInterface {
  run(FolioDto: FolioDto): Promise<FolioCollectionInterface | null>;
  
}
