import { NoteCollectionInterface } from "../collection/note.collection.interface";

export interface NoteServiceInterface {
  run(payload: { note: string; company_id: string }): Promise<NoteCollectionInterface>;
}
