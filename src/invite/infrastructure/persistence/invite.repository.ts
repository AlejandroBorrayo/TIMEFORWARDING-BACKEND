// src/transaction/infrastructure/persistence/mongo-transaction.repository.ts
import { InviteModel } from "./schema/invite.schema";
import type { InviteRepositoryInterface } from "../../domain/repositories/invite-repository.interface";
import type { InviteCollectionInterface } from "../../domain/collection/invite.collection.interface";
import { Types } from "mongoose";
import { CreateInviteDto } from "../../domain/dto/create-invite.dto";

export class MongoInviteRepository implements InviteRepositoryInterface {
  async updatePartial(
    existingInvite: InviteCollectionInterface,
    invite: Partial<InviteCollectionInterface>
  ): Promise<InviteCollectionInterface> {
    await InviteModel.updateOne(
      { _id: new Types.ObjectId(existingInvite._id), deleted: false },
      {
        $set: {
          ...invite,
          updated_at: new Date(),
        },
      }
    ).exec();

    return { ...existingInvite, ...invite, updated_at: new Date() };
  }

  async findOne(token: string): Promise<InviteCollectionInterface | null> {
    return InviteModel.findOne({ token })
      .lean<InviteCollectionInterface>()
      .exec();
  }

  async create(
    data: InviteCollectionInterface
  ): Promise<InviteCollectionInterface> {
    const newInvite = new InviteModel({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      deleted: false,
    });
    const saved = await newInvite.save();
    return saved.toObject<InviteCollectionInterface>();
  }
}
