import { ApikeyModel } from "./schema/apikey.schema";
import type { ApikeyRepositoryInterface } from "../../domain/repositories/apikey-repository.interface";
import type { ApikeyCollectionInterface } from "../../domain/collection/apikey.interface";

export class MongoApikeyRepository implements ApikeyRepositoryInterface {
  async findOneById(apikey: string): Promise<ApikeyCollectionInterface | null> {
    return ApikeyModel.findOne({ apikey })
      .lean<ApikeyCollectionInterface>()
      .exec();
  }
}
