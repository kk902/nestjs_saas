import { IsString, IsOptional, IsArray } from 'class-validator';
export class SetPermissDto {
  @IsOptional()
  @IsString()
  saas_name?: string

  @IsString()
  appId: string

  @IsString()
  mcode: string

  @IsArray()
  @IsString({ each: true })
  api_list: string[]
}