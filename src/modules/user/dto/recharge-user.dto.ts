import { IsString, IsMongoId, ValidateIf, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';

// 自定义验证器
@ValidatorConstraint({ name: 'isPositiveNumber', async: false })
class IsPositiveNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    return typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The amount must be a positive number as a string';
  }
}

// DTO 定义
export class RechargeDto {
  @IsMongoId()
  user_id: string;

  @IsString()
  @ValidateIf(o => o.amount != null)
  @Validate(IsPositiveNumberConstraint)
  amount: string;
}