import axios from "axios";

export const postDoing = async (url,range) => {
    try {
        const canvasId = '1';
        const userId = 'user1';// 실제 canvasId를 적절히 설정해야 합니다.
        console.log(`${url}/doing/${canvasId}/${userId}`);
        await axios.post(`${url}/doing/${canvasId}/${userId}`, {
            cursorPosition: range // 커서 위치 전송
        });
        console.log('Cursor position updated');
    } catch (error) {
        console.error('Error updating cursor position:', error);
    }
};

export const getDoing = async (url, quillRef) => {
    try {
        const canvasId = '1';
        const response = await axios.get(`${url}/doing/${canvasId}`);
        if (response.data) {
            const cursors = response.data.cursors;
            cursors.forEach(cursor => {
                if (cursor.userId !== 'user1') { // 자신이 아닌 다른 사용자의 커서 위치만 반영
                    const quillEditor = quillRef.current.getEditor();
                    quillEditor.setSelection(cursor.cursorPosition);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching cursor positions:', error);
    }
};
