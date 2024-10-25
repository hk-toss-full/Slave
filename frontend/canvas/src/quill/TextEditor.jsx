import {useEffect, useRef, useState} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {modules} from './utilss/TextEditorModules.js';
import {CustomInline} from './utilss/CustomInLine.js';
import {debounce} from 'lodash';
import {getDoing, postDoing} from "./utilss/Doing.js";
import {getData, postData} from "./utilss/Data.js";
const ip = `192.168.10.69`
const url = `http://${ip}:8080/api/v1/canvas`;

Quill.register(CustomInline);

const TextEditor = () => {
    const [editorContent, setEditorContent] = useState('');
    const [contentGet, setContentGet] = useState('');
    const quillRef = useRef(null);

    const debouncedSaveContent = useRef(
        debounce((content) => postData(url,content), 500) // 500ms 후에 저장
    ).current;

    const handleChange = (value) => {
        setEditorContent(value);
        debouncedSaveContent(value);
        quillRef.current.getEditor().on('selection-change', handleCursorChange);
    };

// 커서 위치가 변경될 때마다 서버에 저장
    const handleCursorChange = async (range) => {
        if (range) {await postDoing(range, url); } // 서버에 커서 위치 저장
    };

    const handlePostDoing = async () => {
            await postDoing(url, '1');
    };

    const handleGetData = async () => {
        await getData(url, contentGet, setContentGet);
    };

// Quill 에디터에 커서 변화 감지 이벤트 추가
// contentGet이 변경되었을 때 효과를 처리하는 useEffect
    useEffect(() => {
        if (quillRef.current && contentGet) {
            const quillEditor = quillRef.current.getEditor();

            // 현재 커서 위치를 저장
            const currentRange = quillEditor.getSelection();

            // Quill의 setContents API로 내용을 업데이트
            quillEditor.setContents(quillEditor.clipboard.convert(contentGet));

            // 저장된 커서 위치로 다시 이동
            if (currentRange) {
                quillEditor.setSelection(currentRange);
            }

            setEditorContent(contentGet);
        }
    }, [contentGet]);

    useEffect(() => {
        handleGetData();
        const intervalId = setInterval(handleGetData, 2000);
        const intervalId2 = setInterval(handlePostDoing, 2000); // 2초마다 서버에서 커서 위치 받아옴
        return () => {
            clearInterval(intervalId);
            clearInterval(intervalId2);
        };
    }, []);

    return (
        <div className={"w-full h-full overflow-hidden"}>
            <ReactQuill
                ref={quillRef}
                value={editorContent}
                onChange={handleChange}
                modules={modules}
                style={{height: `100%`, maxHeight: `calc(100% - 27px)`}}
            />
        </div>
    );
};

export default TextEditor;
