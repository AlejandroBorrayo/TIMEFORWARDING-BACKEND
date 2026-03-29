import { IsString, IsOptional, IsEmail } from "class-validator";

export class SupplierDto {
  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsString()
  readonly company_id!: string;
}



