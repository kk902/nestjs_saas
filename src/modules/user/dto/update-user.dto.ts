import { IsString, IsPhoneNumber, IsNotEmpty, IsEnum, IsOptional, IsArray, IsBoolean, IsMongoId } from 'class-validator';
import { UserRole } from './create-user.dto';
import { mongo } from 'mongoose';
export class UpdateUserDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  saas_name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: string;

  @IsPhoneNumber('CN')
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  oldPassword?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  appId?: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Ensures each element in the array is a string
  white_list?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Ensures each element in the array is a string
  store_list?: string[];
}
