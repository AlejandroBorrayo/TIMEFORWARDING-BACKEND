// src/transaction/infrastructure/persistence/mongo-transaction.repository.ts
import { CustomerModel } from "./schema/customer.schema";
import type { CustomerRepositoryInterface } from "../../domain/repositories/customer-repository.interface";
import type { CustomerCollectionInterface } from "../../domain/collection/customer.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/dto/page-options.dto";
import { CustomerDto } from "../../domain/dto/customer.dto";
import { Types } from "mongoose";

export class MongoCustomerRepository implements CustomerRepositoryInterface {
  async create(customer: CustomerDto): Promise<CustomerCollectionInterface> {
    const newAddress = new CustomerModel({
      ...customer,
      creator_userid: new Types.ObjectId(customer.creator_userid),
      company_id: new Types.ObjectId(customer.company_id),
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false, // aseguramos que se cree como no eliminado
    });
    const saved = await newAddress.save();
    return saved.toObject<CustomerCollectionInterface>();
  }

  async findAll(
    pageOptions: PageOptionsDto,
    search?: string,
    company_id?: string,
  ): Promise<[CustomerCollectionInterface[], number]> {
    const where: any = { deleted: false };
    if (company_id?.trim()) {
      where.company_id = new Types.ObjectId(company_id.trim());
    }
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      where.$or = [
        { company: regex },
        { company_rfc: regex },
        { "contacts.name": regex },
        { "contacts.email": regex },
        { "contacts.phone": regex },
      ];
    }

    const [items, total] = await Promise.all([
      CustomerModel.find(where)
        .sort({ created_at: -1 })
        .skip((pageOptions.page - 1) * pageOptions.perpage)
        .limit(pageOptions.perpage)
        .lean<CustomerCollectionInterface[]>()
        .exec(),
      CustomerModel.countDocuments(where).exec(),
    ]);

    return [items, total];
  }

  async findOne(_id: string): Promise<CustomerCollectionInterface | null> {
    return CustomerModel.findOne({
      _id: new Types.ObjectId(_id),
      deleted: false, // nunca traer eliminados
    })
      .lean<CustomerCollectionInterface>()
      .exec();
  }

  async updatePartial(
    existingUser: CustomerCollectionInterface,
    user: Partial<CustomerCollectionInterface>
  ): Promise<CustomerCollectionInterface> {
    await CustomerModel.updateOne(
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
