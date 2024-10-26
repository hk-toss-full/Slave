const WebSocket = require('ws');

// WebSocket 서버에 연결
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('서버에 연결되었습니다.');
  // 메시지를 JSON 형식의 문자열로 변환하여 전송
  ws.send(JSON.stringify({ message: 'Node.js 클라이언트에서 보낸 메시지' }));
});

ws.on('message', function message(data) {
  // 받은 메시지를 JSON으로 파싱 시도
  try {
    const parsedData = JSON.parse(data);
    console.log('서버에서 받은 메시지:', parsedData);
  } catch (error) {
    console.log('문자열로 변환된 데이터:', data.toString('utf8'));
  }
});

ws.on('close', function close() {
  console.log('서버와의 연결이 종료되었습니다.');
});
