import { FolioCollectionInterface } from "../collection/folio.collection.interface";


export interface SetQuoteActiveServiceInterface {
  run(folio:string,quote:string): Promise<FolioCollectionInterface | null>;
  
}
