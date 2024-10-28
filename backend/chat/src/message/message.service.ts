import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
// import { EventEntity } from './event.entity';

@Injectable()
export class MessageService {
  constructor(
      @InjectRepository(Message)
      private eventsRepository: Repository<Message>
      // private messageRepository: MessageRepository
  ) {}

  async create(data: string,
               workspaceId: number,
               channelId: number): Promise<Message> {
    const event = new Message();
    event.data = data;
    event.workspaceId = workspaceId;
    event.chatRoomId = channelId;
    event.senderId = 1;
    return this.eventsRepository.save(event);
  }


  async getAll(workspaceId: number, chatRoomId: number) {
    return this.findMessagesByWorkspaceIdAndChatRoomId(workspaceId, chatRoomId);
  }

  async findMessagesByWorkspaceIdAndChatRoomId(workspaceId: number, chatRoomId: number): Promise<Message[]> {
    return this.eventsRepository.find({
      where: { workspaceId, chatRoomId },  // 조건에 맞는 메시지를 조회
    });
  }
}