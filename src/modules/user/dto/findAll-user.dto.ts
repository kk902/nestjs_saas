import { IsInt, Min, Max } from 'class-validator';

export class FindAllUserDto {
  @IsInt()
  @Min(1, { message: 'Page index must be a positive integer greater than 0.' })
  page_index: number;

  @IsInt()
  @Min(1, { message: 'Page size must be a positive integer greater than 0.' })
  @Max(100, { message: 'Page size cannot be greater than 100.' })
  page_size: number;
}
