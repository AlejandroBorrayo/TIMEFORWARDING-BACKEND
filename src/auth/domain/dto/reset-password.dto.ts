import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: "No debe de estár vacío" })
  @IsString({ message: "No debe de estár vacío" })
  readonly new_password!: string;
}
