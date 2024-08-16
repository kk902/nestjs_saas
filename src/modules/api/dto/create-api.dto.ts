import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateApiDto {
  @IsString()
  @IsNotEmpty()
  saas_api: string

  @IsString()
  @IsNotEmpty()
  map_api?: string

  @IsString()
  @IsNotEmpty()
  describe: string
  
  @Optional()
  status?: boolean
}
