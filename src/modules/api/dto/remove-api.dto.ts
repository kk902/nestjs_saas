import { IsNotEmpty, IsString } from "class-validator";

export class RemoveApiDto {
  @IsString()
  @IsNotEmpty()
  saas_api: string
}