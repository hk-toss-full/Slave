const WebSocket = require('ws');

// WebSocket 서버 생성 (포트 8080)
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('클라이언트가 연결되었습니다.');

  // 클라이언트가 메시지를 보냈을 때 처리
  ws.on('message', (message) => {
    const messageString = message.toString('utf8'); // Buffer를 문자열로 변환
    console.log('Received from client:', messageString);
    
    // 클라이언트로 응답 메시지 전송
    ws.send(`서버에서 받은 메시지: ${messageString}`);
  });

  // 클라이언트와의 연결이 종료되었을 때 처리
  ws.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });

  // 연결된 클라이언트로 환영 메시지 전송
  ws.send('서버에 연결되었습니다!');
});

// 서버가 실행 중임을 알리는 콘솔 메시지
console.log('WebSocket 서버가 포트 8080에서 실행 중입니다.');
