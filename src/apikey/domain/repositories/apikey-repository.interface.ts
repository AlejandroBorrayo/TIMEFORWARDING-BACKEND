import { ApikeyCollectionInterface } from "../collection/apikey.interface";

export const APIKEY_REPOSITORY = Symbol('ApikeyRepositoryInterface');

export interface ApikeyRepositoryInterface {
  findOneById(apikey: string): Promise<ApikeyCollectionInterface | null>;
}
