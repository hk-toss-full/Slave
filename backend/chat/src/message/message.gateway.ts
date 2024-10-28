import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './message.service';
import { Scope } from '@nestjs/common';

@WebSocketGateway(3002, { cors: { origin: '*' } }) // 웹 소켓 게이트웨이 정의
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private workspaceId: number | null = null; // workspaceId 저장
  private chatRoomId: number | null = null;   // chatRoomId 저장


  constructor(private readonly messageService: MessageService) {
  }

  afterInit(server: Server) { // WebSocket 서버가 초기화된 후 호출
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
      @MessageBody() body: { workspaceId: number; chatRoomId: number },
      @ConnectedSocket() client: any
  ): Promise<void> {
    // 개별 변수에 클라이언트 정보 저장
    console.log("joinRoom ------------------------");
    this.workspaceId = body.workspaceId;
    this.chatRoomId = body.chatRoomId;
    // console.log(`Client joined room: workspaceId = ${body.workspaceId}, chatRoomId = ${body.chatRoomId}`);
    // 필요한 로직을 추가하세요, 예를 들어 방에 클라이언트를 추가하는 등의 작업.
  }

  async handleConnection(client: any) {
    // 클라이언트가 서버에 연결될 때 호출됩니다
    const allMessages = await this.messageService.getAll(this.workspaceId,this.chatRoomId);
    // console.log("000000000000000000000000000"+allMessages)
    this.server.emit('getMessages', allMessages)
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) { // 클라이언트가 서버와의 연결을 끊을 때 호출됩니다.
    // console.log(`Client disconnected: ${client.id}`);
    this.workspaceId = null;
    this.chatRoomId = null;
  }

  /**
   * 상대방이 채팅을 쳤을 떄
   * @param clientId
   * @param body
   */
  @SubscribeMessage('message') // 특정 이벤트(예: 클라이언트가 전송하는 메시지)에 대한 핸들러를 정의
  async handleMessage(
      // @ConnectedSocket() client: any,
      @MessageBody() body: { message: string}): Promise<void> {
    console.log(`Message from client ${body.message}`);
    const savedMessage = await this.messageService.create(body.message, this.workspaceId, this.chatRoomId);
    this.server.emit('newMessage', savedMessage); // 클라이언트로 메시지를 전송합니다.
  }
}