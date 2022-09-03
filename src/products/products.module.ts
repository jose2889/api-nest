import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Chat } from './entities/product.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/httpService.config';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [HttpModule.registerAsync({
    useClass: HttpConfigService,
  }),
    TypeOrmModule.forFeature([ Chat ])
  ]
})
export class ProductsModule {}
