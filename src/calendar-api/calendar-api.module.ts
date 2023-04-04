import { Module } from '@nestjs/common';
import { CalendarApiService } from './calendar-api.service';
import { CalendarEventsController } from './calendar-api.controller';
import { GoogleAuthService } from './google-auth-service';

@Module({
  controllers: [CalendarEventsController],
  providers: [CalendarApiService, GoogleAuthService]
})
export class CalendarApiModule {}
