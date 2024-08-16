import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStoreDto {
  @IsString()
  @IsNotEmpty()
  mcode: string

  @IsArray()
  @IsNotEmpty()
  api_list: string[]
}
