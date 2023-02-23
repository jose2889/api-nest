import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarApiService } from './calendar-api.service';
import { CreateCalendarApiDto } from './dto/create-calendar-api.dto';
import { UpdateCalendarApiDto } from './dto/update-calendar-api.dto';

@Controller('calendar-api')
export class CalendarApiController {
  constructor(private readonly calendarApiService: CalendarApiService) {}

  @Post()
  create(@Body() createCalendarApiDto: CreateCalendarApiDto) {
    return this.calendarApiService.create(createCalendarApiDto);
  }

  @Get()
  findAll() {
    return this.calendarApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCalendarApiDto: UpdateCalendarApiDto) {
    return this.calendarApiService.update(+id, updateCalendarApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarApiService.remove(+id);
  }
}
