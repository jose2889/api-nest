import { PartialType } from '@nestjs/swagger';
import { CreateSystemApiDto } from './create-system-api.dto';

export class UpdateSystemApiDto extends PartialType(CreateSystemApiDto) {}
