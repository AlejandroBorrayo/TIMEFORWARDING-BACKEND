import type {
  DecodedExternalUser,
  DecodedUser,
} from "../dto/decoded-user.type";
import type { JwtSignType } from "../dto/jwt.sign.type";

export const JWT_SERVICE = Symbol("JwtServiceInterface");

export interface JwtServiceInterface {
  sign(payload: any, expiresIn: number, secret: string): string;
  signByType(payload: any, expiresIn: number, type: JwtSignType): string;
  verify(token: string, secret: string): Promise<DecodedUser>;
  decode(token: string): Promise<any>;
}
