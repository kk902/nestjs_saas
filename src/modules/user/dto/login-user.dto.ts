import { IsString, IsPhoneNumber, IsNotEmpty, MinLength } from 'class-validator';
export class LoginUserDto {
  @IsString()
  @IsPhoneNumber('CN',{message: "手机号格式不正确"})
  phone_number: string;

  @IsString()
  @MinLength(6, { message: '密码至少要6位' })
  password: string;
}
