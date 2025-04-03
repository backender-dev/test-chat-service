import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { UserModule } from './modules/user/user.module';
import { MessageModule } from './modules/message/message.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3001),
        API_PREFIX: Joi.string().default('api'),
        CORS_URI_LIST: Joi.string().default('*'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().port().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_SSL: Joi.boolean().truthy('true').falsy('false').required(),
        EXTERNAL_WS_URL: Joi.string().uri().required(),
        EXTERNAL_HTTP_URL: Joi.string().uri().required(),
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get('POSTGRES_PORT'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          database: config.get('POSTGRES_DB'),
          ssl: config.get('POSTGRES_SSL'),
          synchronize: false,
          logging: false,
          entities: [path.join(__dirname + '/**/*.entity{.ts,.js}')],
          migrations: [path.join(__dirname, '/database/migrations/*{.ts,.js}')],
          migrationsRun: true,
          migrationsTransactionMode: 'each',
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    WebsocketModule,
    UserModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
