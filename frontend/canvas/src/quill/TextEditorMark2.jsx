import { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { modules } from './utils/TextEditorModules.js';
import { CustomInline } from './utils/CustomInLine.js';
import debounce from 'lodash.debounce';
import {getData, postData} from "./utils/Data.js";
const ip = `192.168.10.69`;
const url = `http://${ip}:8080/api/v1/canvas`;

Quill.register(CustomInline);

const workspace_id = 1;
const conversation_id = 1;
const canvas_id = 2;

const TextEditor = () => {
    const quillRef = useRef(null); // Quill instance reference
    const doc = new Y.Doc(); // Create Yjs document

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const textType = doc.getText('quill-content'); // Yjs text type

        const binding = new QuillBinding(textType, quill);

        const debouncedUpdateHandler = debounce(async () => {
            await postData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 250);

        const updateHandler = () => debouncedUpdateHandler(); // 텍스트 업데이트 감지
        doc.on('update', updateHandler);

        const handleGetData = async () => {await getData(url, workspace_id, conversation_id, canvas_id, doc, Y);} // 최신 데이터로 갱신
        handleGetData();

        const interval = setInterval(handleGetData, 1000);

        return () => {
            clearInterval(interval);
            doc.off('update', updateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel();
        };
    }, [doc]);

    return (
        <div className={"w-full h-full overflow-hidden"}>
            <ReactQuill
                ref={quillRef}
                modules={modules}
                style={{ height: `100%`, maxHeight: `calc(100% - 27px)` }}
            />
        </div>
    );
};

export default TextEditor;
