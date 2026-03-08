import { IsNotInBlacklist } from '@shared/validators/email-blacklist.validator';
import { Transform } from 'class-transformer';
import { IsEmail} from 'class-validator';

export class ForgotPasswordDto {

  @IsEmail({}, { message: "Email inválido" })
  @IsNotInBlacklist()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly email!: string;


}
