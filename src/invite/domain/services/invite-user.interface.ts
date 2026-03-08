import { InviteCollectionInterface } from "../collection/invite.collection.interface";
import { CreateInviteDto } from "../dto/create-invite.dto";

export interface InviteUserServiceInterface {
  run(
    invite: CreateInviteDto,
    apiKey: string
  ): Promise<InviteCollectionInterface | null>;
}
