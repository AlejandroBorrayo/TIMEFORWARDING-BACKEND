import { DecodedUser } from '../../../auth/domain/dto/decoded-user.type';
import type { UpdateUserDto } from '../dto/update-user.dto';
import type { UserCollectionInterface } from '../collection/user.collection.interface';

export const UPDATE_USER_SERVICE = Symbol('UpdateUserServiceInterface');

export interface UpdateUserServiceInterface {
  run(
    userid: string,
    payload: UpdateUserDto,
    decodedUser: DecodedUser,
  ): Promise<UserCollectionInterface | null>;
}
