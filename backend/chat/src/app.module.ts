import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';
import { MessageGateway } from './message/message.gateway';
import { MessageService } from './message/message.service';
import { DmModule } from './dm/dm.module';
import {Dm} from "./dm/entities/dm.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',  // MySQL 설정
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '131072',
      database: 'test',
      entities: [Message, Dm],
      synchronize: true, // 개발 환경에서만 사용
    }),
    TypeOrmModule.forFeature([Message,Dm]),
    MessageModule,
    DmModule,
  ],
  providers: [],
})
export class AppModule {}