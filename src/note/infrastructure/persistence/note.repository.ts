// src/transaction/infrastructure/persistence/mongo-transaction.repository.ts
import { NoteModel } from "./schema/note.schema";
import type { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";
import type { NoteCollectionInterface } from "../../domain/collection/note.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/dto/page-options.dto";
import { Types } from "mongoose";

export class MongoNoteRepository implements NoteRepositoryInterface {
  async create(payload: {
    note: string;
    company_id: string;
  }): Promise<NoteCollectionInterface> {
    const newAddress = new NoteModel({
      note: payload.note,
      company_id: new Types.ObjectId(payload.company_id),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false, // aseguramos que se cree como no eliminado
    });
    const saved = await newAddress.save();
    return saved.toObject<NoteCollectionInterface>();
  }

  async findAll(
    pageOptions: PageOptionsDto,
    company_id?: string,
  ): Promise<[NoteCollectionInterface[], number]> {
    const where: any = { deleted: false };
    if (company_id?.trim()) {
      where.company_id = new Types.ObjectId(company_id.trim());
    }

    const [items, total] = await Promise.all([
      NoteModel.find(where)
        .sort({ created_at: -1 })
        .skip((pageOptions.page - 1) * pageOptions.perpage)
        .limit(pageOptions.perpage)
        .lean<NoteCollectionInterface[]>()
        .exec(),
      NoteModel.countDocuments(where).exec(),
    ]);

    return [items, total];
  }

  async findOne(_id: string): Promise<NoteCollectionInterface | null> {
    return NoteModel.findOne({
      _id: new Types.ObjectId(_id),
      deleted: false, // nunca traer eliminados
    })
      .lean<NoteCollectionInterface>()
      .exec();
  }

  async updatePartial(
    existingNote: NoteCollectionInterface,
    note: Partial<NoteCollectionInterface>
  ): Promise<NoteCollectionInterface> {
    const updatedAt = new Date();
  
    await NoteModel.updateOne(
      { _id: existingNote._id, deleted: false },
      {
        $set: {
          ...note,
          updated_at: updatedAt,
        },
      }
    ).exec();
  
    return {
      ...existingNote,
      ...note,
      updated_at: updatedAt,
    };
  }
  
}
