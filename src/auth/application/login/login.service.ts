// src/auth/application/login.service.ts
import * as bcrypt from 'bcrypt';
import type { UserRepositoryInterface } from '../../../user/domain/repository/user-repository.interface';
import type { JwtServiceInterface } from '../../domain/services/jwt-service.interface';
import type { FindApikeyByServiceInterface } from '../../../apikey/domain/services/find-apikey-by-service.interface';
import type { DecodedUser } from '../../domain/dto/decoded-user.type';
import type { LoginUserDto } from '../../domain/dto/login-user.dto';
import type { LoginServiceInterface } from '../../domain/services/login-service.interface';

export interface LoginServiceConfig {
  expiresIn: number;
}

export class LoginService implements LoginServiceInterface {
  private readonly expiresIn: number;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly findApikeyByApikeyService: FindApikeyByServiceInterface,
    private readonly jwtService: JwtServiceInterface,
    config: LoginServiceConfig,
  ) {
    this.expiresIn = config.expiresIn;
  }

  async run(
    payload: LoginUserDto,
    apiKey: string,
  ): Promise<{ access_token: string }> {
    try {
      // Verificamos que el usuario exista
      const user = await this.userRepository.findByLogin(payload.email);
      if (!user || !user.password) {
        const err: any = new Error('Invalid credentials');
        err.status = 401;
        throw err;
      }
      // Comprobamos la contraseña
      const isSamePassword = await bcrypt.compare(payload.password, user.password);
      if (!isSamePassword) {
        const err: any = new Error('Invalid credentials');
        err.status = 401;
        throw err;
      }

      // Verificamos API key
      const userApikey = await this.findApikeyByApikeyService.run(apiKey);
      if (!userApikey) {
        const err: any = new Error('User not allowed');
        err.status = 403;
        throw err;
      }
      // Payload para JWT
      const responsePayload: Partial<DecodedUser> = {
        name: user.full_name,
        email: user.email,
        sub: user._id,
        role: user.role,
      };

      return {
        access_token: this.jwtService.sign(
          responsePayload,
          this.expiresIn,
          userApikey.secret,
        ),
      };
    } catch (error: any) {
      console.error('[LoginService]', error);
      if (!error.status) {
        error.status = 500;
        error.message = 'Internal server error';
      }
      throw error;
    }
  }
}
