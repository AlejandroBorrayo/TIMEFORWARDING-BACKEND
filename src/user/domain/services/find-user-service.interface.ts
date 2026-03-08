import type {  UserCollectionInterface } from '../collection/user.collection.interface';

export const FIND_USER_SERVICE = Symbol('FindUserServiceInterface');

export interface FindUserServiceInterface {
  run(userid?: string): Promise<UserCollectionInterface>;
}
