import { IsNotEmpty, IsString } from "class-validator";

export class CreateFolioWithoutCostDto {
  @IsString()
  @IsNotEmpty()
  seller_userid!: string;

  @IsString()
  @IsNotEmpty()
  company_id!: string;

  @IsString()
  @IsNotEmpty()
  folio!: string;
}
