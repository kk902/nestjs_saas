import { Optional } from '@nestjs/common';
import { IsString, IsArray, IsMongoId } from 'class-validator';
export class CreditLineDto {
  
  @IsArray()
  @IsMongoId({ each: true })
  user_list: string[]

  @IsString()
  credit_line: string

}
