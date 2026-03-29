import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  logo!: string;

  @IsOptional()
  @IsString()
  rfc?: string;
}
