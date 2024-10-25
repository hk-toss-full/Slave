import axios from "axios";

export const getData = async (url, contentGet, setContentGet) => {
    try {
        const canvasId = '1'; // 실제 canvasId를 적절히 설정해야 합니다.
        const response = await axios.get(`${url}/${canvasId}`);
        if (response.data) {
            const content = response.data.data; // content 속성만 추출
            // content가 변경되었을 때만 업데이트
            if(content !== contentGet) {
                console.log("Content updated, updating editor");
                setContentGet(content);
            }
        }
    } catch (error) {
        console.error('Error fetching document content:', error);
    }
};

export const postData = async (url, content) => {
    try {
        const canvasId = '1'; // 실제 canvasId를 적절히 설정해야 합니다.
        await axios.post(`${url}/${canvasId}`, {
            data: content,
        });
        console.log('Document updated');
    } catch (error) {
        console.error('Error updating document:', error);
    }
};