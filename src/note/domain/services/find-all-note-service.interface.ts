import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { NoteCollectionInterface } from "../collection/note.collection.interface";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";



export interface FindAllNoteServiceInterface {
  run(
    pagination: PageOptionsDto,
    search?: string
  ): Promise<PageMetaDto<NoteCollectionInterface>>;
}
