import { IsMongoId, IsString } from "class-validator"
import { IsPositiveNumber } from "./recharge-order.dto"

export class DeductOrderDto {
  @IsMongoId()
  user_id: string

  @IsString()
  @IsPositiveNumber()
  amount: string
}
