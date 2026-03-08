import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { NoteCollectionInterface } from "../collection/note.collection.interface";

export interface NoteRepositoryInterface {
  create(note: string): Promise<NoteCollectionInterface>;
  findAll(
    pageOptions: PageOptionsDto,
  ): Promise<[NoteCollectionInterface[], number]>;
  findOne(_id?: string): Promise<NoteCollectionInterface | null>;

  updatePartial(
    existingnote: NoteCollectionInterface,
    note: NoteCollectionInterface
  ): Promise<NoteCollectionInterface>;
}
