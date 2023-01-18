import { Injectable } from '@nestjs/common';
import { CreateSystemApiDto } from './dto/create-system-api.dto';
import { UpdateSystemApiDto } from './dto/update-system-api.dto';

@Injectable()
export class SystemApiService {
  create(createSystemApiDto: CreateSystemApiDto) {
    return 'This action adds a new systemApi';
  }

  findAll() {
    return `This action returns all systemApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemApi`;
  }

  update(id: number, updateSystemApiDto: UpdateSystemApiDto) {
    return `This action updates a #${id} systemApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemApi`;
  }
}
