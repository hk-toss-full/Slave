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
}