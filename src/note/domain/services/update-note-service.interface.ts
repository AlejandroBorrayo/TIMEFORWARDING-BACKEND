import type { NoteCollectionInterface } from '../collection/note.collection.interface';


export interface UpdateNoteServiceInterface {
  run(
    _id:string,
    note: NoteCollectionInterface,
  ): Promise<NoteCollectionInterface | null>;
}
