// src/transaction/infrastructure/persistence/mongo-transaction.repository.ts
import { TaxModel } from "./schema/tax.schema";
import type { TaxRepositoryInterface } from "../../domain/repositories/tax-repository.interface";
import type { TaxCollectionInterface } from "../../domain/collection/tax.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/dto/page-options.dto";
import { Types } from "mongoose";

export class MongoTaxRepository implements TaxRepositoryInterface {
  async create(tax: {
    name: string;
    amount: number;
    company_id: string;
  }): Promise<TaxCollectionInterface> {
    const newAddress = new TaxModel({
      name: tax.name,
      amount: tax.amount,
      company_id: new Types.ObjectId(tax.company_id),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false, // aseguramos que se cree como no eliminado
    });
    const saved = await newAddress.save();
    return saved.toObject<TaxCollectionInterface>();
  }

  async findAll(
    pageOptions: PageOptionsDto,
    company_id?: string,
  ): Promise<[TaxCollectionInterface[], number]> {
    const where: any = { deleted: false };
    if (company_id?.trim()) {
      where.company_id = new Types.ObjectId(company_id.trim());
    }

    const [items, total] = await Promise.all([
      TaxModel.find(where)
        .sort({ created_at: -1 })
        .skip((pageOptions.page - 1) * pageOptions.perpage)
        .limit(pageOptions.perpage)
        .lean<TaxCollectionInterface[]>()
        .exec(),
      TaxModel.countDocuments(where).exec(),
    ]);

    return [items, total];
  }

  async findOne(_id: string): Promise<TaxCollectionInterface | null> {
    return TaxModel.findOne({
      _id: new Types.ObjectId(_id),
      deleted: false, // nunca traer eliminados
    })
      .lean<TaxCollectionInterface>()
      .exec();
  }

  async updatePartial(
    existingNote: TaxCollectionInterface,
    note: Partial<TaxCollectionInterface>
  ): Promise<TaxCollectionInterface> {
    const updatedAt = new Date();
  
    await TaxModel.updateOne(
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
