import type { FolioCollectionInterface } from "../collection/folio.collection.interface";
import type { SetFolioDisabledDto } from "../dto/set-folio-disabled.dto";

export interface SetFolioDisabledServiceInterface {
  run(dto: SetFolioDisabledDto): Promise<FolioCollectionInterface | null>;
}
