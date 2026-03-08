import { NoteCollectionInterface } from "../collection/note.collection.interface";

export interface NoteServiceInterface {
  run(note: string): Promise<NoteCollectionInterface>;
}
