import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/whastapp.module';
import { CommonModule } from './common/common.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { SystemApiModule } from './config/system-api/system-api.module';
import { SystemEmailModule } from './config/system-email/system-email.module';
import { BusinessModule } from './business/business.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      autoLoadEntities: true,
      synchronize: true,
    }),

    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USEREMAIL,
            pass: process.env.EMAIL_PASSWORD
          },
          defaults: {
            from: process.env.EMAIL_USEREMAIL,
          },
        },
      }),
    }),

    ProductsModule,

    CommonModule,

    SystemApiModule,

    SystemEmailModule,

    BusinessModule,
  ],
  providers: [],
})
export class AppModule {
  
}
