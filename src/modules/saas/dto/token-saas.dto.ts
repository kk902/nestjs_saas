import { IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class TokenSaasDto {
  @IsString()
  @IsMongoId()
  appId: string

  @IsString()
  @IsNotEmpty()
  key: string
}
