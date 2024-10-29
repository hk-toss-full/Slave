import { Injectable } from '@nestjs/common';
import { CreateDmDto } from './dto/create-dm.dto';
import { UpdateDmDto } from './dto/update-dm.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Dm} from "./entities/dm.entity";
import {Repository} from "typeorm";
import {Message} from "../message/entities/message.entity";

@Injectable()
export class DmService {
  constructor(
      @InjectRepository(Dm)
      private dmRepository: Repository<Dm>,
  ) {}

  async create(senderId: number, receiverId: number, workspaceId:number, data:string) {
    const event = new Dm();
    event.data = data;
    event.workspaceId = workspaceId;
    event.receiverId = receiverId;
    event.senderId = senderId;
    return this.dmRepository.save(event);
  }

  async findAll(senderId: number, receiverId: number, workspaceId: number) {
    return this.dmRepository
        .createQueryBuilder('dm')
        .where('dm.senderId = :senderId', { senderId })
        .andWhere('dm.receiverId = :receiverId', { receiverId })
        .andWhere('dm.workspaceId = :workspaceId', { workspaceId })
        .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} dm`;
  }

  update(id: number, updateDmDto: UpdateDmDto) {
    return `This action updates a #${id} dm`;
  }

  remove(id: number) {
    return `This action removes a #${id} dm`;
  }
}
