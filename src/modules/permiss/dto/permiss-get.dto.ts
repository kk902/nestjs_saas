import { IsString, IsOptional, IsArray } from 'class-validator';
export class GetPermissDto {
  @IsString()
  appId: string

  @IsString()
  mcode: string
}