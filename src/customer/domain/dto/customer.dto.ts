import { IsArray, ValidateNested, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ContactDto {
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CustomerDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts!: ContactDto[];

  @IsString()
  company!: string;

  @IsOptional()
  @IsString()
  company_rfc?: string;

  @IsString()
  creator_userid!: string;

  @IsBoolean()
  deleted!: boolean;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}