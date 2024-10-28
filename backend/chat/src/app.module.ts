import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';
import { MessageGateway } from './message/message.gateway';
import { MessageService } from './message/message.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',  // MySQL 설정
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      entities: [Message],
      synchronize: true, // 개발 환경에서만 사용
    }),
    TypeOrmModule.forFeature([Message]),
    MessageModule,
  ],
  providers: [],
})
export class AppModule {}