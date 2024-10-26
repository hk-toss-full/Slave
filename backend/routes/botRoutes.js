const express = require('express');
const { createBot, scheduleBot, filterMessage, scheduleEvent, getBot } = require('../controllers/botController');

const router = express.Router();

// 봇 생성 라우트
router.post('/workspaces/:workspaceId/conversations/:conversationId/bot', createBot);

// 봇 스케줄 생성 및 변경 라우트
router.post('/workspaces/:workspaceId/conversations/:conversationId/bot/schedule', scheduleBot);
router.put('/workspaces/:workspaceId/conversations/:conversationId/bot/schedule', scheduleBot);

// 특정 단어 필터링 라우트
router.post('/workspaces/:workspaceId/conversations/:conversationId/bot/message', filterMessage);

// 이벤트 알림 생성 및 변경 라우트
router.post('/workspaces/:workspaceId/conversations/:conversationId/bot/event', scheduleEvent);
router.put('/workspaces/:workspaceId/conversations/:conversationId/bot/event', scheduleEvent);

// 봇 조회 라우트
router.get('/workspaces/:workspaceId/conversations/:conversationId/bot', getBot);

module.exports = router;
