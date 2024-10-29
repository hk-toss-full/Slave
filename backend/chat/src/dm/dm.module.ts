import { Module } from '@nestjs/common';
import { DmService } from './dm.service';
import { DmGateway } from './dm.gateway';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "../message/entities/message.entity";
import {MessageGateway} from "../message/message.gateway";
import {MessageService} from "../message/message.service";
import {Dm} from "./entities/dm.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Dm])],
  providers: [DmGateway, DmService],
})
export class DmModule {}