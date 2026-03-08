import type { CreateUserServiceInterface } from "@user/domain/services/create-user-service.interface";
import { AcceptInviteDto } from "../dto/accept-invite.dto";
import { DecodedUser } from '@auth/domain/dto/decoded-user.type';
import { UserCollectionInterface } from "@user/domain/collection/user.collection.interface";


export interface InviteAcceptServiceInterface {
  run(invite: AcceptInviteDto): Promise<UserCollectionInterface>;
}
