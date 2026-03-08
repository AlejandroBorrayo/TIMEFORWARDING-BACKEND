import { FolioCollectionInterface } from "../collection/folio.collection.interface";


export interface SetServiceCostActiveServiceInterface {
  run(folio:string,service_cost:string): Promise<FolioCollectionInterface | null>;
  
}
