import { CreateUserDto } from '@user/domain/dto/create-user.dto';
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, IsEmail } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;


  @IsNotEmpty()
  @IsString()
  role!: string;
  
}
