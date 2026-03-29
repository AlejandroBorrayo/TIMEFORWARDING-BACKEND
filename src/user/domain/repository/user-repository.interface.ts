import type { FilterByEmailOrId } from "../Types";
import type { UserCollectionInterface } from "../../domain/collection/user.collection.interface";
import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";

export const USER_REPOSITORY = Symbol("UserRepositoryInterface");

export interface UserRepositoryInterface {
  exists(email: string): Promise<boolean>;
  findAll(
    pageOptions: PageOptionsDto,
    search: string,
  ): Promise<[UserCollectionInterface[], number]>;
  findByEmailOrId(userid?: string): Promise<UserCollectionInterface | null>;
  findByEmailOrIdValidation(
    filter: FilterByEmailOrId
  ): Promise<UserCollectionInterface | null>;
  findByLogin(email: string): Promise<UserCollectionInterface | null>;
  create(
    user: Partial<UserCollectionInterface>
  ): Promise<UserCollectionInterface>;
  updatePartial(
    existingUser: UserCollectionInterface,
    user: Partial<UserCollectionInterface>
  ): Promise<UserCollectionInterface>;
  updateById(
    userid: string,
    user: Partial<UserCollectionInterface>
  ): Promise<UserCollectionInterface | null>;
}
