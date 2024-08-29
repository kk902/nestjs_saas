import { IsMongoId, IsString, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator"

export class RechargeOrderDto {
  @IsMongoId()
  user_id: string

  @IsString()
  @IsPositiveNumber()
  amount: string

}
export function IsPositiveNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const num = Number(value);
          return !isNaN(num) && num > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `The value of ${args.property} must be a positive number.`;
        }
      }
    });
  };
}