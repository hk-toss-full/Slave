import axios from "axios";
import debounce from "lodash.debounce";

export const getCursor = async (url, workspace_id, conversation_id, canvas_id, userID, cursors) => {
    try {
        const response = await axios.get(`${url}/cursor/${workspace_id}/${conversation_id}/${canvas_id}`);
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
        const localState = awareness.getLocalState().user;
        await axios.post(`${url}/cursor`, {cursor: localState},
            { headers: {
                'workspace_id': `${workspace_id}`,
                'conversation_id': `${conversation_id}`,
                'canvas_id': `${canvas_id}`,
                'user_id': `${userID}`}});
    } catch (error) {
        console.error('Failed to post cursor:', error);
    }
}, 250);