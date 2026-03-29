import type { FolioCollectionInterface } from "../collection/folio.collection.interface";
import type { CreateFolioWithoutCostDto } from "../dto/create-folio-without-cost.dto";

export interface CreateFolioWithoutCostServiceInterface {
  run(dto: CreateFolioWithoutCostDto): Promise<FolioCollectionInterface | null>;
}
