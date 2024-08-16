import { PartialType } from '@nestjs/mapped-types';
import { CreateSaaDto } from './create-saa.dto';

export class UpdateSaaDto extends PartialType(CreateSaaDto) {}
