import axios from "axios";
import debounce from "lodash.debounce";

export const getCursor = async (url, workspace_id, conversation_id, canvas_id, userID, cursors) => {
    try {
        const response = await axios.get(`${url}/cursor/workspaces/${workspace_id}/conversations/${conversation_id}/canvas/${canvas_id}`);
        const remoteCursors = response.data;
        if(remoteCursors === ""){return;}
        let cursorJson = [];
        remoteCursors.forEach(str => {cursorJson.push(JSON.parse(str))})
        cursors.clearCursors();
        cursorJson.forEach(cursor => {
            if (cursor.cursor.name !== userID) {
                cursors.createCursor(cursor.cursor.name, cursor.cursor.name, cursor.cursor.color);
                cursors.moveCursor(cursor.cursor.name, cursor.cursor.range);
            }
        });
    } catch (error) {
        console.error('Failed to get cursor:', error);
    }
};

export const postCursor = debounce(async (url, workspace_id, conversation_id, canvas_id, userID, awareness) => {
    try {
        const encodedText = btoa(unescape(encodeURIComponent(userID)));
        const localState = awareness.getLocalState().user;
        await axios.post(`${url}/cursor/sse`, {cursor: localState},
            { headers: {
                'workspace_id': `${workspace_id}`,
                'conversation_id': `${conversation_id}`,
                'canvas_id': `${canvas_id}`,
                'user_id': `=?UTF-8?B?${encodedText}?=`}});
    } catch (error) {
        console.error('Failed to post cursor:', error);
    }
}, 250);

export const sseCursor = (url, workspace_id, conversation_id, canvas_id, cursors, userID) => {
    const eventSource = new EventSource(`${url}/cursor/sse/workspaces/${workspace_id}/conversations/${conversation_id}/canvas/${canvas_id}`);

    eventSource.onmessage = (event) => {
        cursors.clearCursors();
        JSON.parse(event.data).forEach(cursor => {
            if (cursor.cursor.name !== userID) {
                cursors.createCursor(cursor.cursor.name, cursor.cursor.name, cursor.cursor.color);
                cursors.moveCursor(cursor.cursor.name, cursor.cursor.range);
            }
        })
    };

    eventSource.onerror = () => {
        console.error('Error with SSE, attempting to reconnect...');
        eventSource.close();
        setTimeout(() => {
            sseCursor(); // 일정 시간 후 재연결 시도
        }, 3000); // 3초 후 재연결
    };
};