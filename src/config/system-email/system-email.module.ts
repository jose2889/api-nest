import { Module } from '@nestjs/common';
import { SystemEmailService } from './system-email.service';
import { SystemEmailController } from './system-email.controller';

@Module({
  controllers: [SystemEmailController],
  providers: [SystemEmailService]
})
export class SystemEmailModule {}
