import { IsString, IsPhoneNumber, IsOptional, IsMongoId } from 'class-validator';
export class FindOneUserDto {
  @IsOptional()
  @IsMongoId()
  user_id?: string;

  @IsOptional()
  @IsPhoneNumber('CN')
  phone_number?: string;
}