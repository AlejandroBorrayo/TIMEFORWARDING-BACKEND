import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class SetFolioDisabledDto {
  @IsString()
  @IsNotEmpty()
  folio!: string;

  @IsBoolean()
  disabled!: boolean;
}
