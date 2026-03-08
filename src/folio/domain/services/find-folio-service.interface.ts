import { FolioCollectionInterface } from "../collection/folio.collection.interface";

export interface FindFolioServiceInterface {
  run(folio:string): Promise<FolioCollectionInterface | null>;
}
