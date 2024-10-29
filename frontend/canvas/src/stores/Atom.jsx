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
