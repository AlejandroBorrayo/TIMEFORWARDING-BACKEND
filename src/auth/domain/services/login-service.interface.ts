import type { LoginUserDto } from '../dto/login-user.dto';

export const LOGIN_SERVICE = Symbol('LoginServiceInterface');

export interface LoginServiceInterface {
  run(payload: LoginUserDto, apiKey: string): Promise<{ access_token: string }>;
}
