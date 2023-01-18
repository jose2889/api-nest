import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemEmailService } from './system-email.service';
import { CreateSystemEmailDto } from './dto/create-system-email.dto';
import { UpdateSystemEmailDto } from './dto/update-system-email.dto';

@Controller('system-email')
export class SystemEmailController {
  constructor(private readonly systemEmailService: SystemEmailService) {}

  @Post()
  create(@Body() createSystemEmailDto: CreateSystemEmailDto) {
    return this.systemEmailService.create(createSystemEmailDto);
  }

  @Get()
  findAll() {
    return this.systemEmailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemEmailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSystemEmailDto: UpdateSystemEmailDto) {
    return this.systemEmailService.update(+id, updateSystemEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemEmailService.remove(+id);
  }
}
