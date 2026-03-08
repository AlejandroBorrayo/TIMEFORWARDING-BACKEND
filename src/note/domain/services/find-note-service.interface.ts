import { NoteCollectionInterface } from "../collection/note.collection.interface";



export interface FindNoteServiceInterface {
  run(
    _id:string
  ): Promise<NoteCollectionInterface | null>;
}
