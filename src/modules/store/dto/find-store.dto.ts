import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class FindOneStoreDto {
  @IsOptional()
  @IsArray()
  store_list?: string[]
}

export class FindAllStoreDto {
  @IsNumber()
  @IsNotEmpty()
  page_index: number
  
  @IsNumber()
  @IsNotEmpty()
  page_size: number
}