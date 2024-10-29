import {WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { UpdateDmDto } from './dto/update-dm.dto';
import {Server} from "socket.io";

@WebSocketGateway(3003, { cors: { origin: '*' } })
export class DmGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly dmService: DmService) {}
  afterInit(server: Server) { // WebSocket 서버가 초기화된 후 호출
    console.log('DM : WebSocket server initialized');
  }

  async handleConnection(client: any) {
    // 클라이언트가 서버에 연결될 때 호출됩니다
    // const allMessages = await this.messageService.getAll(this.workspaceId,this.chatRoomId);
    // this.server.emit('getMessages', allMessages)
    // this.server.emit('getMessages', allMessages)
  }

  handleDisconnect(client: any) { // 클라이언트가 서버와의 연결을 끊을 때 호출됩니다.
    // this.workspaceId = null;
    // this.chatRoomId = null;
  }
  @SubscribeMessage('createDm')
  async create(@MessageBody() body: {senderId: number; receiverId: number; workspaceId:number; data:string}) {
    const savedMessage = await this.dmService.create(body.senderId, body.receiverId, body.workspaceId, body.data);
    console.log(savedMessage);
    this.server.emit('newMessage', savedMessage);
  }

  @SubscribeMessage('findAllDm')
  async findAll(@MessageBody() body: { senderId: number; receiverId: number; workspaceId:number }) {
    const allMessages = await this.dmService.findAll(body.senderId, body.receiverId,body.workspaceId);
    // console.log(allMessages)
    this.server.emit('getMessages', allMessages)
  }

  // @SubscribeMessage('findOneDm')
  // findOne(@MessageBody() id: number) {
  //   return this.dmService.findOne(id);
  // }

  // @SubscribeMessage('updateDm')
  // update(@MessageBody() updateDmDto: UpdateDmDto) {
  //   return this.dmService.update(updateDmDto.id, updateDmDto);
  // }
  //
  // @SubscribeMessage('removeDm')
  // remove(@MessageBody() id: number) {
  //   return this.dmService.remove(id);
  // }
}
