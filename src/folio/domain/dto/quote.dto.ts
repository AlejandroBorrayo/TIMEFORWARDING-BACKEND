import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

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

export class QuoteDto {
  @IsString()
  @IsOptional()
  seller_userid?: string;


  @IsString()
  @IsNotEmpty()
  currency!: string;

  

  @IsString()
  @IsOptional()
  period_end_date?: Date;


  @IsString()
  @IsOptional()
  contact_id?: string;
  

  @IsString()
  @IsOptional()
  customer_id?: string;


  @IsString()
  @IsNotEmpty()
  folio!: string;

  @IsString()
  @IsNotEmpty()
  service_cost!: string;

  @ValidateNested({ each: true })
  @Type(() => Object)
  items!: ItemDto[];

  @ValidateNested({ each: true })
  @Type(() => Object)
  notes?: string[];
}
