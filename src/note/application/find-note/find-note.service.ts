import type { NoteCollectionInterface } from "../../domain/collection/note.collection.interface";
import type { FindNoteServiceInterface } from "../../domain/services/find-note-service.interface";
import type { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";

export class FindNoteService implements FindNoteServiceInterface {
  private noteRepository: NoteRepositoryInterface;

  constructor(
    noteRepository: NoteRepositoryInterface
  ) {
    this.noteRepository = noteRepository;
  }

  async run(
    _id:string
  ): Promise<NoteCollectionInterface | null> {
    try {
      return await this.noteRepository.findOne(_id);


    } catch (err) {
      console.error("[FindNoteService][run]", err);
      throw err;
    }
  }
}
