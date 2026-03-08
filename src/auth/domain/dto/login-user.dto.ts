import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsNotInBlacklist } from '@shared/validators/email-blacklist.validator';

export class LoginUserDto {
  @IsNotEmpty({ message: "No debe de estár vacío" })
  @IsString({ message: "Debe de ser string" })
  @IsEmail({}, { message: "Debe de ser email" })
  @IsNotInBlacklist()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly email!: string;

  @IsNotEmpty({ message: "No debe de estár vacío" })
  @IsString({ message: "Debe de ser string" })
  readonly password!: string;
}
