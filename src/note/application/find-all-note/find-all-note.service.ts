import type { NoteCollectionInterface } from "../../domain/collection/note.collection.interface";
import type { FindAllNoteServiceInterface } from "../../domain/services/find-all-note-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type {  } from "../../../user/domain/repository/user-repository.interface";
import type { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";

export class FindAllNoteService implements FindAllNoteServiceInterface {
  private noteRepository: NoteRepositoryInterface;

  constructor(
    noteRepository: NoteRepositoryInterface
  ) {
    this.noteRepository = noteRepository;
  }

  async run(
    pagination: PageOptionsDto,
    company_id?: string,
  ): Promise<PageMetaDto<NoteCollectionInterface>> {
    try {
      const [entities, total] = await this.noteRepository.findAll(
        pagination,
        company_id,
      );

      return new PageMetaDto<NoteCollectionInterface>({
        total,
        pageOptions: pagination,
        records: entities,
      });
    } catch (err) {
      console.error("[FindAllNoteService][run]", err);
      throw err;
    }
  }
}
