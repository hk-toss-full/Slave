import axios from "axios";

export const getData = async (url, workspace_id, conversation_id, canvas_id, doc, Y) => {
    try {
        const response = await axios.get(`${url}/${workspace_id}/${conversation_id}/${canvas_id}`,
            { responseType: 'arraybuffer' });
        const update = new Uint8Array(response.data);
        Y.applyUpdateV2(doc, update);
    } catch (error) {
        console.error("Failed to fetch updates:", error);
    }
};

export const postData = async (url, workspace_id, conversation_id, canvas_id, doc, Y) => {
    const update = Y.encodeStateAsUpdateV2(doc);
    await axios.post(`${url}`, update, {
        headers: {'workspace_id': `${workspace_id}`,
            'conversation_id': `${conversation_id}`,
            'canvas_id': `${canvas_id}`,
            'Content-Type': 'application/octet-stream'
        }
    });
};

// export const postAwarenessData = async (awarenessUrl, workspace_id, conversation_id, canvas_id, awareness) => {
//     try {
//         const awarenessState = {
//             // 유저 이름이 같은 경우 기존 상태를 대체
//             ...Object.fromEntries(Object.entries(awareness.getLocalState()).filter(([key, value]) => key !== 'user')),
//             user: {
//                 name: localStorage.getItem('userName') || 'User',
//                 color: localStorage.getItem('userColor') || '#000000'
//             }
//         };
//         await axios.post(`${awarenessUrl}`, awarenessState, {
//             headers: {
//                 'workspace_id': `${workspace_id}`,
//                 'conversation_id': `${conversation_id}`,
//                 'canvas_id': `${canvas_id}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//     } catch (error) {
//         console.error("Failed to post awareness data:", error);
//     }
// };
//
// export const getAwarenessData = async (awarenessUrl, workspace_id, conversation_id, canvas_id, awareness) => {
//     try {
//         const response = await axios.get(`${awarenessUrl}/${workspace_id}/${conversation_id}/${canvas_id}`);
//         const remoteAwarenessState = response.data;
//         if (remoteAwarenessState) {
//             try {
//                 const existingState = awareness.getLocalState();
//
//                 awareness.setLocalState({
//                     anchor: remoteAwarenessState.anchor,
//                     head: remoteAwarenessState.head,
//                     user: {
//                         name: localStorage.getItem('userName') || 'User',
//                         color: localStorage.getItem('userColor') || '#000000'
//                     }
//                 });
//             } catch (e) {
//                 console.error("Failed to parse awareness data:", e);
//             }
//         }
//     } catch (error) {
//         console.error("Failed to fetch awareness data:", error);
//     }
// };
