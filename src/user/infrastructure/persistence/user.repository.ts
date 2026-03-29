import { UserModel } from "./schema/user.schema";
import type { UserRepositoryInterface } from "../../domain/repository/user-repository.interface";
import type { UserCollectionInterface } from "../../domain/collection/user.collection.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/dto/page-options.dto";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

export class MongoUserRepository implements UserRepositoryInterface {
  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({
      email,
      deleted: false,
    }).exec();
    return count > 0;
  }

  async findAll(
    pageOptions: PageOptionsDto,
    search: string,
  ): Promise<[UserCollectionInterface[], number]> {
    // Construimos el filtro base
    const filter: any = { deleted: false };


    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i"); // i = case insensitive
      filter.$or = [
        { email: regex },
        { full_name: regex },
      ];
    }

    const [items, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ created_at: -1 })
        .skip((pageOptions.page - 1) * pageOptions.perpage)
        .limit(pageOptions.perpage)
        .lean<UserCollectionInterface[]>()
        .exec(),
      UserModel.countDocuments(filter).exec(),
    ]);

    return [items, total];
  }

  async findByEmailOrId(userid?: string): Promise<UserCollectionInterface | null> {
    if (!userid?.trim()) return null;
    const raw = userid.trim();
    const where: Record<string, unknown> = {};
    // Un solo argumento: si es hex de 24 chars, buscar por _id; si no, por email.
    if (/^[a-fA-F0-9]{24}$/.test(raw)) {
      where._id = new Types.ObjectId(raw);
    } else {
      where.email = raw.toLowerCase();
    }
    return UserModel.findOne(where).lean<UserCollectionInterface>().exec();
  }

  async findByLogin(email: string): Promise<UserCollectionInterface | null> {
    return UserModel.findOne({ email })
      .select("+password")
      .lean<UserCollectionInterface>()
      .exec();
  }

  async findByEmailOrIdValidation(filter: {
    email?: string;
    _id?: string;
  }): Promise<UserCollectionInterface | null> {
    const where: any = { deleted: false };

    if (filter.email) where.email = filter.email;
    if (filter._id) where._id = new Types.ObjectId(filter._id);

    return UserModel.findOne(where, {
      _id: 1,
      full_name: 1,
      email: 1,
      password: 1,
      phone: 1,
      role: 1,
      deleted: 1,
    })
      .lean<UserCollectionInterface>()
      .exec();
  }

  async create(
    user: Partial<UserCollectionInterface>
  ): Promise<UserCollectionInterface> {
    const payload: Record<string, unknown> = {
      ...user,
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
    };
    const newUser = new UserModel(payload);
    const saved = await newUser.save();
    return saved.toObject<UserCollectionInterface>();
  }

  async updatePartial(
    existingUser: UserCollectionInterface,
    user: Partial<UserCollectionInterface>
  ): Promise<UserCollectionInterface> {
    const updateData = { ...user, updated_at: new Date() };
    if (user?.password) {
      updateData.password = await bcrypt.hash(user.password, 10);
    }
    await UserModel.updateOne(
      { _id: new Types.ObjectId(existingUser._id) },
      { $set: updateData }
    ).exec();

    return { ...existingUser, ...user, updated_at: new Date() };
  }

  async updateById(
    _id: string,
    user: Partial<UserCollectionInterface>
  ): Promise<UserCollectionInterface | null> {
    const updated = await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_id), deleted: false },
      {
        $set: {
          ...user,
          updated_at: new Date(),
        },
      },
      { new: true }
    )
      .lean<UserCollectionInterface>()
      .exec();

    return updated;
  }
}
