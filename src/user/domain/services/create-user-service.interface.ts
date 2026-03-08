import type { PublicInviteDecodedUser } from '../../../auth/domain/dto/decoded-user.type';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UserCollectionInterface } from '../collection/user.collection.interface';

export const CREATE_USER_SERVICE = Symbol('CreateUserServiceInterface');

export interface CreateUserServiceInterface {
  run(
    user: Partial<CreateUserDto & { entities?: string[] }>,
    publicInviteUser?: PublicInviteDecodedUser,
  ): Promise<UserCollectionInterface>;
}
