import { IsMongoId } from "class-validator"

export class FindOneOrderDto {
  @IsMongoId()
  order_id: String
}