import type { NoteServiceInterface } from "../../domain/services/note-service.interface";
import type { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";
import type { NoteCollectionInterface } from "../../domain/collection/note.collection.interface";

export class CreateNoteService implements NoteServiceInterface {
  private noteRepository: NoteRepositoryInterface;

  constructor(
    noteRepository: NoteRepositoryInterface
  ) {
    this.noteRepository = noteRepository;
  }

  async run(payload: { note: string; company_id: string }): Promise<any> {
    try {
      return await this.noteRepository.create(payload);
    } catch (err) {
      console.error("[TransactionService][run]", err);
      throw err;
    }
  }
}
