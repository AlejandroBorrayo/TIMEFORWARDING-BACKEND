import { CreateUserDto } from '@user/domain/dto/create-user.dto';
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class AcceptInviteDto extends CreateUserDto{
  @IsNotEmpty()
  @IsNumber()
  invite!: string;
  
}
