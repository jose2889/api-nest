import { SystemApiModule } from './system-api/system-api.module';
import { Module } from '@nestjs/common';
import { SystemEmailModule } from './system-email/system-email.module';

@Module({
    controllers: [],
    providers: [],
    imports:[SystemEmailModule,SystemApiModule],
})
export class ConfiguModule {}
