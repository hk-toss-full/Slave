import { atom } from 'recoil';

export const WorkspaceState = atom({
    key: 'workspaceId', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: '1', // 초기값
});

export const ConversationState = atom({
    key: 'conversationId', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: '1', // 초기값
});

export const CanvasState = atom({
    key: 'canvasId', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: '1',
});

export const CodeState = atom({
    key: 'CodeValue', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: Array(6).fill(""),
});

export const EmailState = atom({
    key: 'EmailValue', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: 'saftedf@naver.com',
});

export const ConversationNameState = atom({
    key: 'conversationName', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: '공지사항', // 초기값
});

export const ConversationListState = atom({
    key: 'conversationList', // 고유한 key 값, 상태를 구분하는데 사용됨
    default: [
        {conversationId: 1, conversationName: '공지사항', conversationType: 1},
        {conversationId: 2, conversationName: '조경준', conversationType: 2},
        {conversationId: 3, conversationName: '한경프론트엔드', conversationType: 1},
        {conversationId: 4, conversationName: '한경풀스택', conversationType: 1},
        {conversationId: 5, conversationName: '조예은', conversationType: 2},
        {conversationId: 6, conversationName: '이승진', conversationType: 2},
        {conversationId: 7, conversationName: '한경백엔드', conversationType: 1}
    ], // 초기값
});
