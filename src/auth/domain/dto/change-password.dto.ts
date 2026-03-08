import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty({ message: "No debe de estar vacío" })
  @IsString({ message: "No debe de estar vacío" })
  readonly currentPassword!: string;

  @IsNotEmpty({ message: "No debe de estar vacío" })
  @IsString({ message: "No debe de estar vacío" })
  readonly newPassword!: string;
}
