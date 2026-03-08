import type { InviteDecodedUser } from '../dto/decoded-user.type';

export const VERIFY_INVITE_TOKEN_SERVICE = Symbol(
  'VerifyInviteTokenServiceInterface',
);

export interface VerifyInviteTokenServiceInterface {
  run(invitation: InviteDecodedUser): Promise<boolean>;
}
