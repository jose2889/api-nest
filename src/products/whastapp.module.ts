import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { Chat } from './entities/chat.entity';
import { LogFail } from './entities/log-fail.entity';
import { SendTemplate } from './entities/send-template.entity';
import { SystemConfigEntity } from './entities/system-config.entity';
import { EmailConfigEntity } from './entities/email-config.entity';
import { BackupDBController } from './backup.controller';
import { BachpuDBService } from './backup.service';
import { HttpConfigService } from 'src/httpService.config';
import { Webhookontroller } from './webhooks.controller';
import { ApiWs } from './entities/api-ws.entity';



@Module({
  controllers: [WhatsappController, Webhookontroller, BackupDBController],
  providers: [WhatsappService, BachpuDBService],
  imports: [HttpModule.registerAsync({
    useClass: HttpConfigService,
  }),
    TypeOrmModule.forFeature([ Chat, ApiWs, LogFail, SendTemplate, SystemConfigEntity, EmailConfigEntity ])
  ],

})
export class ProductsModule {}
