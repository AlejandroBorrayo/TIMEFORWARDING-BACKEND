import { CompanyModel } from "./schema/company.schema";
import type { CompanyRepositoryInterface } from "../../domain/repositories/company-repository.interface";
import type { CompanyCollectionInterface } from "../../domain/collection/company.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { Types } from "mongoose";

export class MongoCompanyRepository implements CompanyRepositoryInterface {
  async create(
    data: Partial<CompanyCollectionInterface>,
  ): Promise<CompanyCollectionInterface> {
    const doc = new CompanyModel({
      ...data,
      deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const saved = await doc.save();
    return saved.toObject<CompanyCollectionInterface>();
  }

  async findAll(
    pageOptions: PageOptionsDto,
    search?: string,
  ): Promise<[CompanyCollectionInterface[], number]> {
    const where: Record<string, unknown> = { deleted: false };
    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      where.$or = [{ name: regex }, { rfc: regex }];
    }

    const [items, total] = await Promise.all([
      CompanyModel.find(where)
        .sort({ created_at: -1 })
        .skip((pageOptions.page - 1) * pageOptions.perpage)
        .limit(pageOptions.perpage)
        .lean<CompanyCollectionInterface[]>()
        .exec(),
      CompanyModel.countDocuments(where).exec(),
    ]);

    return [items, total];
  }

  async findOne(_id: string): Promise<CompanyCollectionInterface | null> {
    return CompanyModel.findOne({
      _id: new Types.ObjectId(_id),
      deleted: false,
    })
      .lean<CompanyCollectionInterface>()
      .exec();
  }

  async updatePartial(
    existing: CompanyCollectionInterface,
    data: Partial<CompanyCollectionInterface>,
  ): Promise<void> {
    await CompanyModel.updateOne(
      {
        _id: new Types.ObjectId(String(existing._id)),
        deleted: false,
      },
      {
        $set: {
          ...data,
          updated_at: new Date(),
        },
      },
    ).exec();
  }
}
