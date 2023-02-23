import { PartialType } from '@nestjs/swagger';
import { CreateCalendarApiDto } from './create-calendar-api.dto';

export class UpdateCalendarApiDto extends PartialType(CreateCalendarApiDto) {}
