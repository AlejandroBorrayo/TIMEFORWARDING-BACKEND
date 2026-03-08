// src/auth/application/auth.service.ts
import type { AuthServiceInterface } from '../../domain/services/auth-service.interface';
import type { DecodedExternalUser, DecodedUser } from '../..//domain/dto/decoded-user.type';
import type { JwtServiceInterface } from '../..//domain/services/jwt-service.interface';
import type { FindApikeyByServiceInterface } from '../../../apikey/domain/services/find-apikey-by-service.interface';

export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly jwtService: JwtServiceInterface,
  ) {}

  async verifyToken(token: string, apiKey: string): Promise<DecodedUser> {
    try {
      return await this.jwtService.verify(token, apiKey);
    } catch (error) {
      console.error('[AuthService.verifyToken]', error);
      throw { status: 401, message: 'Invalid token' };
    }
  }


}
