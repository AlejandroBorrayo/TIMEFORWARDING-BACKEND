import type {
  DecodedExternalUser,
  DecodedUser,
} from '../dto/decoded-user.type';

export const AUTH_SERVICE = Symbol('AuthServiceInterface');

export interface AuthServiceInterface {
  verifyToken(token: string, apiKey: string): Promise<DecodedUser>;
}
