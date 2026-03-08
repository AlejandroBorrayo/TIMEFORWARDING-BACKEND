export type JwtSignType =
  | 'forgotPassword'
  | 'invite'
  | 'publicInvite'
  | 'changeEmail'
  | 'user';

export type GetCurrentUserType =
  | 'passwordResetUser'
  | 'invitedUser'
  | 'publicInvitedUser'
  | 'changeEmailUser'
  | 'user';
