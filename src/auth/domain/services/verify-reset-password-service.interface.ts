import type { ForgotPasswordDecodedUser } from '../dto/decoded-user.type';

export const VERIFY_RESET_PASSWORD_TOKEN_SERVICE = Symbol(
  'VerifyResetPasswordTokenServiceInterface',
);

export interface VerifyResetPasswordTokenServiceInterface {
  run(userToReset: ForgotPasswordDecodedUser): Promise<boolean>;
}
