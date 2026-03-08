import type { ChangePasswordDto } from '../dto/change-password.dto';
import type { DecodedUser } from '../dto/decoded-user.type';

export const CHANGE_PASSWORD_SERVICE = Symbol('ChangePasswordServiceInterface');

export interface ChangePasswordServiceInterface {
  run(
    currentUser: DecodedUser,
    request: ChangePasswordDto,
  ): Promise<{ success: boolean }>;
}
