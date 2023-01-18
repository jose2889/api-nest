import { Module } from '@nestjs/common';
import { SystemApiService } from './system-api.service';
import { SystemApiController } from './system-api.controller';

@Module({
  controllers: [SystemApiController],
  providers: [SystemApiService]
})
export class SystemApiModule {}
