// src/auth/application/jwt.service.ts
import * as jwt from "jsonwebtoken";
import type {
  DecodedExternalUser,
  DecodedUser,
} from "../../domain/dto/decoded-user.type";
import { JwtSignType } from "../../domain/dto/jwt.sign.type";
import type { JwtServiceInterface } from "../../domain/services/jwt-service.interface";

export interface JwtConfig {
  secret: string;
}

export class JwtService implements JwtServiceInterface {
  private readonly secret: string;

  constructor(config: JwtConfig) {
    this.secret = config.secret;
  }

  sign(payload: any, expiresIn: number, secret: string): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  signByType(payload: any, expiresIn: number, type: JwtSignType): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  async verify(token: string, secret: string): Promise<DecodedUser> {
    try {
      return jwt.verify(token, secret) as DecodedUser;
    } catch (error: any) {
      console.error("[JwtService.verify]", error);
      const err: any = new Error("Invalid token");
      err.status = 401;
      err.property = "JWT";
      throw err;
    }
  }

  decode(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error: any) {
      const err: any = new Error("Invalid token");
      err.status = 401;
      err.property = "JWT";
      throw err;
    }
  }
}
