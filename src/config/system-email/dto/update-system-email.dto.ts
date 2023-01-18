import { PartialType } from '@nestjs/swagger';
import { CreateSystemEmailDto } from './create-system-email.dto';

export class UpdateSystemEmailDto extends PartialType(CreateSystemEmailDto) {}
