import { IsString, IsPhoneNumber, IsNotEmpty, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  saas_name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsPhoneNumber('CN',{message: "手机号格式不正确"})
  phone_number: string;

  @IsString()
  @MinLength(6, { message: '密码至少要6位' })
  password: string;

  @IsOptional()
  @IsString()
  appId?: string;

  @IsString({ message: 'key不能为空' })
  @IsNotEmpty({ message: 'key不能为空' })
  key: string;

  @IsOptional()
  @IsArray()
  store_list: string[]
}
