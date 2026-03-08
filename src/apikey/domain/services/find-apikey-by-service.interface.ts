import { ApikeyCollectionInterface } from "../collection/apikey.interface";

export const FIND_APIKEY_BY_SERVICE = Symbol('FindApikeyByServiceInterface');

export interface FindApikeyByServiceInterface {
  run(apikey: string): Promise<ApikeyCollectionInterface>;
}
