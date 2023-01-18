import { Injectable } from '@nestjs/common';
import { CreateSystemEmailDto } from './dto/create-system-email.dto';
import { UpdateSystemEmailDto } from './dto/update-system-email.dto';

@Injectable()
export class SystemEmailService {
  create(createSystemEmailDto: CreateSystemEmailDto) {
    return 'This action adds a new systemEmail';
  }

  findAll() {
    return `This action returns all systemEmail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemEmail`;
  }

  update(id: number, updateSystemEmailDto: UpdateSystemEmailDto) {
    return `This action updates a #${id} systemEmail`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemEmail`;
  }
}
