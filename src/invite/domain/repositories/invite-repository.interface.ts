import { InviteCollectionInterface } from "../collection/invite.collection.interface";
import { CreateInviteDto } from "../dto/create-invite.dto";

export interface InviteRepositoryInterface {
  updatePartial(
    existInvite: InviteCollectionInterface,
    invite: Partial<InviteCollectionInterface>
  ): Promise<InviteCollectionInterface>;

  findOne(_id: string): Promise<InviteCollectionInterface | null>;

  create(
    invite: Partial<InviteCollectionInterface>
  ): Promise<InviteCollectionInterface | null>;
}
