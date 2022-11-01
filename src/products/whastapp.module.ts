import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';

import { Chat } from './entities/chat.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/httpService.config';
import { Webhookontroller } from './webhooks.controller';
import { Apiws } from './entities/api_ws.entity';
import { LogFail } from './entities/log-fail.entity';


@Module({
  controllers: [WhatsappController, Webhookontroller],
  providers: [WhatsappService],
  imports: [HttpModule.registerAsync({
    useClass: HttpConfigService,
  }),
    TypeOrmModule.forFeature([ Chat, Apiws, LogFail ])
  ]
})
export class ProductsModule {}
