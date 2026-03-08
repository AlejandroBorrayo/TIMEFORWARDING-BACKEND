import { Transform } from "class-transformer";
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Full name should not be empty" })
  @IsString({ message: "Full name must be a string" })
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly full_name!: string;

  @IsNotEmpty({ message: "Email should not be empty" })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Email must be valid" })
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly email!: string;

  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString({ message: "Password must be a string" })
  readonly password!: string;

  @IsString({ message: "Phone must be a string" })
  @Length(10, 10, { message: "Phone must have exactly 10 digits" })
  @Matches(/^\d+$/, { message: "Phone must contain only digits" })
  readonly phone?: string;

  @IsNotEmpty({ message: "Role should not be empty" })
  @IsString({ message: "Role must be a string" })
  readonly role!: string;

  @IsOptional()
  @IsNumber({}, { message: "Commission must be a number" })
  readonly commission?: number;

  @IsOptional()
  @IsString({ message: "Type commission must be a string" })
  @IsIn(["percentage", "amount"], {
    message: "Type commission must be 'percentage' or 'amount'",
  })
  readonly type_commission?: "percentage" | "amount";
}
