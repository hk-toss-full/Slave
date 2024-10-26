const cron = require('node-cron');
const client = require('../config/redis');
const WebSocket = require('ws');

// 타이머 및 스케줄을 관리할 객체
const eventTimers = {};
const scheduleMap = {};

// WebSocket 서버에 연결하는 함수
let ws;
const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:8080/chat'); // WebSocket 서버 주소

  ws.on('open', () => {
    console.log('봇이 WebSocket 서버에 연결되었습니다.');
  });

  ws.on('message', async (message) => {
    let receivedMessage = '';
    if (Buffer.isBuffer(message)) {
      receivedMessage = message.toString('utf8'); // Buffer일 경우 UTF-8로 변환
    } else {
      receivedMessage = message; // 이미 문자열일 경우 그대로 사용
    }
    
    console.log('Received from chat:', receivedMessage);
  
    // Redis에서 저장된 filtering_word 값을 가져옴
    const botConfig = await client.hGetAll(`slack:bot:${workspaceId}:${conversationId}`);
    const filteringWord = botConfig.filtering_word || '';
  
    // 필터링 단어가 포함되어 있으면 봇이 반응
    if (receivedMessage.includes(filteringWord)) {
      ws.send('봇: 욕설은 그만!');
    }
  });
  

  ws.on('close', () => {
    console.log('WebSocket 연결이 종료되었습니다. 재연결 시도 중...');
    setTimeout(connectWebSocket, 5000); // 5초 후 재연결 시도
  });
};

// WebSocket 서버에 메시지를 보내는 함수
const sendMessageToChat = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    console.log('WebSocket 연결이 열려 있지 않아서 메시지를 전송할 수 없습니다.');
  }
};

// 서버 시작 시 WebSocket 연결
connectWebSocket();

// 봇 생성
const createBot = async (req, res) => {
  const { workspaceId, conversationId } = req.params;
  const { message, alert_time, event_name, event_description, event_time, filtering_word } = req.body;

  try {
    const botConfig = {
      message: message || '',
      alert_time: alert_time || '',
      event_name: event_name || '',
      event_description: event_description || '',
      event_time: event_time || '',
      filtering_word: filtering_word || ''
    };
    await client.hSet(`slack:bot:${workspaceId}:${conversationId}`, botConfig);
    res.status(201).send('Bot created successfully');
  } catch (err) {
    console.error('Error while creating bot:', err);
    res.status(500).send('Failed to create bot');
  }
};

// 봇 스케줄 생성 및 변경
const scheduleBot = async (req, res) => {
  const { workspaceId, conversationId } = req.params;
  const { cronExpression, message } = req.body;
  const scheduleKey = `${workspaceId}:${conversationId}`;

  try {
    // 기존 스케줄이 있으면 중지
    if (scheduleMap[scheduleKey]) {
      scheduleMap[scheduleKey].stop();
    }

    // 새로운 스케줄 생성
    const newSchedule = cron.schedule(cronExpression, async () => {
      console.log(`Sending message to workspace: ${workspaceId}, channel: ${conversationId}`);
      sendMessageToChat(message); // WebSocket으로 메시지 전송
    });

    // 스케줄 저장
    scheduleMap[scheduleKey] = newSchedule;

    res.status(201).send('Bot schedule created/updated successfully');
  } catch (err) {
    console.error('Error while creating/updating bot schedule:', err);
    res.status(500).send('Failed to create/update bot schedule');
  }
};

// 특정 단어 필터링 기능
const filterMessage = async (req, res) => {
  const { workspaceId, conversationId } = req.params;
  const { message } = req.body;

  try {
    const botConfig = await client.hGetAll(`slack:bot:${workspaceId}:${conversationId}`);
    const filteringWord = botConfig.filtering_word;

    if (message.includes(filteringWord)) {
      sendMessageToChat("봇: 욕설은 그만!"); // 필터링 단어 감지 시 WebSocket 메시지 전송
      res.send("Warning: 욕설은 그만!");
    } else {
      res.send("Message accepted.");
    }
  } catch (err) {
    console.error('Error while filtering word:', err);
    res.status(500).send('Failed to process message');
  }
};

// 이벤트 알림 기능
const scheduleEvent = async (req, res) => {
  const { workspaceId, conversationId } = req.params;
  const { event_name, event_description, event_time } = req.body;
  const eventKey = `${workspaceId}:${conversationId}`;

  try {
    // 기존 타이머가 있으면 중지
    if (eventTimers[eventKey]) {
      clearTimeout(eventTimers[eventKey]);
    }

    // Redis에 이벤트 정보 저장
    await client.hSet(`slack:bot:event:${workspaceId}:${conversationId}`, {
      event_name,
      event_description,
      event_time
    });

    // 이벤트 시간 계산
    const eventTimestamp = new Date(event_time).getTime();
    const currentTimestamp = Date.now();
    const timeUntilEvent = eventTimestamp - currentTimestamp;

    // 이벤트 타이머 설정
    const eventTimer = setTimeout(() => {
      console.log(`Event Reminder: ${event_name} - ${event_description}`);
      sendMessageToChat(`봇: ${event_name} - ${event_description} 이벤트가 시작되었습니다.`);
    }, timeUntilEvent);

    eventTimers[eventKey] = eventTimer;

    res.status(201).send('Event scheduled successfully');
  } catch (err) {
    console.error('Error while scheduling event:', err);
    res.status(500).send('Failed to schedule event');
  }
};

// 봇 조회 (GET 방식)
const getBot = async (req, res) => {
  const { workspaceId, conversationId } = req.params;

  try {
    const botConfig = await client.hGetAll(`slack:bot:${workspaceId}:${conversationId}`);
    if (Object.keys(botConfig).length === 0) {
      return res.status(404).send('Bot not found');
    }
    res.status(200).json(botConfig);
  } catch (err) {
    console.error('Error while retrieving bot:', err);
    res.status(500).send('Failed to retrieve bot');
  }
};

module.exports = {
  createBot,
  scheduleBot,
  filterMessage,
  scheduleEvent,
  getBot,
  sendMessageToChat
};
