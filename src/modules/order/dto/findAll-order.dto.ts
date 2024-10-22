import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class FindAllOrderDto {
  @IsNumber()
  @IsNotEmpty()
  page: number
  
  @IsNumber()
  @IsNotEmpty()
  limit: number

  @IsOptional()
  @IsString()
  saas_name?: String
  
  @IsOptional()
  @IsMongoId()
  user_id?: String
  
  @IsOptional()
  @IsMongoId()
  order_id?: String

  @IsOptional()
  @IsDateString()
  start_time?: string
  
  @IsOptional()
  @IsDateString()
  end_time?: string
}

