import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim().toLowerCase() : value))
  readonly full_name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Debe de ser email válido" })
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly role?: string;

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
