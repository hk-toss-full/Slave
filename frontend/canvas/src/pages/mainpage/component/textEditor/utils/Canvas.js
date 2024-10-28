import axios from "axios";

export const getCanvas = async (url, workspace_id, conversation_id, canvas_id, doc, Y) => {
    try {
        const response = await axios.get(`${url}/${workspace_id}/${conversation_id}/${canvas_id}`,
            { responseType: 'arraybuffer' });
        const update = new Uint8Array(response.data);
        Y.applyUpdateV2(doc, update);
    } catch (error) {
        console.error("Failed to fetch updates:", error);
    }
};

export const postCanvas = async (url, workspace_id, conversation_id, canvas_id, doc, Y) => {
    const update = Y.encodeStateAsUpdateV2(doc);
    await axios.post(`${url}/sse`, update, {
        headers: {'workspace_id': `${workspace_id}`,
            'conversation_id': `${conversation_id}`,
            'canvas_id': `${canvas_id}`,
            'Content-Type': 'application/octet-stream'
        }
    });
};

export const sseCanvas = (url, workspace_id, conversation_id, canvas_id, doc, Y) => {
    const eventSource = new EventSource(`${url}/sse/${workspace_id}/${conversation_id}/${canvas_id}`);

    eventSource.onmessage = (event) => {
        const binaryString = atob(event.data);  // Base64 디코딩
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);  // 문자열을 Uint8Array로 변환
        }

        Y.applyUpdateV2(doc, bytes);  // 디코딩된 Uint8Array를 적용
    };

    eventSource.onerror = () => {
        console.error('Error with SSE, attempting to reconnect...');
        eventSource.close();
        setTimeout(() => {
            sseCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 3000);
    };
};

function stringToByteArray(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}