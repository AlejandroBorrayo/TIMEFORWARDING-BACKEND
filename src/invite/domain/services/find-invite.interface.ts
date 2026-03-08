import { InviteCollectionInterface } from "../collection/invite.collection.interface";


export interface findInviteUserServiceInterface {
  run(_id: string): Promise<InviteCollectionInterface | null>;
}
