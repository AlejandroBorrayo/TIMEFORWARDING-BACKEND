// src/transaction/infrastructure/persistence/mongo-transaction.repository.ts
import { SupplierModel } from "./schema/supplier.schema";
import type { SupplierRepositoryInterface } from "../../domain/repositories/supplier-repository.interface";
import type { SupplierCollectionInterface } from "../../domain/collection/supplier.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/dto/page-options.dto";
import { SupplierDto } from "../../domain/dto/supplier.dto";
import { Types } from "mongoose";

export class MongoSupplierRepository implements SupplierRepositoryInterface {
  async create(supplier: SupplierDto): Promise<SupplierCollectionInterface> {
    const newAddress = new SupplierModel({
      ...supplier,
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false, // aseguramos que se cree como no eliminado
    });
    const saved = await newAddress.save();
    return saved.toObject<SupplierCollectionInterface>();
  }

  async findAll(
    pageOptions: PageOptionsDto,
    search?: string
  ): Promise<[SupplierCollectionInterface[], number]> {
    const where: any = { deleted: false };
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      where.$or = [
        { name: regex },
        { email: regex },
      ];
    }

    const [items, total] = await Promise.all([
      SupplierModel.find(where)
        .sort({ created_at: -1 })
        .skip((pageOptions.page - 1) * pageOptions.perpage)
        .limit(pageOptions.perpage)
        .lean<SupplierCollectionInterface[]>()
        .exec(),
      SupplierModel.countDocuments(where).exec(),
    ]);

    return [items, total];
  }

  async findOne(_id: string): Promise<SupplierCollectionInterface | null> {
    return SupplierModel.findOne({
      _id: new Types.ObjectId(_id),
      deleted: false, // nunca traer eliminados
    })
      .lean<SupplierCollectionInterface>()
      .exec();
  }

  async updatePartial(
    existingUser: SupplierCollectionInterface,
    user: Partial<SupplierCollectionInterface>
  ): Promise<SupplierCollectionInterface> {
    await SupplierModel.updateOne(
      { _id: new Types.ObjectId(existingUser._id), deleted: false },
      {
        $set: {
          ...user,
          updated_at: new Date(),
        },
      }
    ).exec();

    return { ...existingUser, ...user, updated_at: new Date() };
  }
}
