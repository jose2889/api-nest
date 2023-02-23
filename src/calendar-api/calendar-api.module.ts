import { Module } from '@nestjs/common';
import { CalendarApiService } from './calendar-api.service';
import { CalendarApiController } from './calendar-api.controller';

@Module({
  controllers: [CalendarApiController],
  providers: [CalendarApiService]
})
export class CalendarApiModule {}
