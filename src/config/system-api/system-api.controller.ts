import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemApiService } from './system-api.service';
import { CreateSystemApiDto } from './dto/create-system-api.dto';
import { UpdateSystemApiDto } from './dto/update-system-api.dto';

@Controller('system-api')
export class SystemApiController {
  constructor(private readonly systemApiService: SystemApiService) {}

  @Post()
  create(@Body() createSystemApiDto: CreateSystemApiDto) {
    return this.systemApiService.create(createSystemApiDto);
  }

  @Get()
  findAll() {
    return this.systemApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSystemApiDto: UpdateSystemApiDto) {
    return this.systemApiService.update(+id, updateSystemApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemApiService.remove(+id);
  }
}
