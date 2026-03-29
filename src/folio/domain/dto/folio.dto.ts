import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class taxDto {
  @IsString()
  name!: string;

  @IsNumber()
  amount!: number;
}

export class ItemDto {
  @IsString()
  name!: string;

  @IsString()
  currency!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  usd_amount!: number;

  @IsNumber()
  quantity!: number;

  @ValidateNested()
  @Type(() => taxDto)
  tax!: taxDto;

  supplier_id!: string;
}

export class FolioDto {
  @IsString()
  @IsNotEmpty()
  seller_userid!: string;

  @IsString()
  @IsNotEmpty()
  company_id!: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ValidateNested({ each: true })
  @Type(() => Object)
  items!: ItemDto[];

  @IsString()
  @IsOptional()
  current_folio?: string;

}

