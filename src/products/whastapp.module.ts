import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';

import { Chat } from './entities/chat.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/httpService.config';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService],
  imports: [HttpModule.registerAsync({
    useClass: HttpConfigService,
  }),
    TypeOrmModule.forFeature([ Chat ])
  ]
})
export class ProductsModule {}
