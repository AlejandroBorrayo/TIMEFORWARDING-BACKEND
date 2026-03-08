import type { NoteRepositoryInterface } from '../../domain/repositories/note-repository.interface';
import type { UpdateNoteServiceInterface } from '../../domain/services/update-note-service.interface';
import type { NoteCollectionInterface } from '../../domain/collection/note.collection.interface';

export class UpdateNoteService implements UpdateNoteServiceInterface {
  constructor(private readonly noteRepository: NoteRepositoryInterface) {}

  async run(
    _id:string,
    note: NoteCollectionInterface,
  ): Promise<NoteCollectionInterface | null> {

    // Buscamos el address que queremos actualizar
    const existingNote = await this.noteRepository.findOne( _id );
    if (!existingNote) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    try {
      // Actualizamos solo los campos permitidos
      await this.noteRepository.updatePartial(existingNote, note);

      // Retornamos el address actualizado
      return await this.noteRepository.findOne(_id );
    } catch (error) {
      console.error('[UpdateNoteService] Error:', error);
      const err: any = new Error('Update error');
      err.status = 500;
      err.property = 'ADDRESS';
      throw err;
    }
  }
}
