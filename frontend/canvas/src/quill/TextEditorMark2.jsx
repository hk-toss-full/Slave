import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import debounce from 'lodash.debounce';
import { getData, postData } from "./utils/Data.js";
import {modules} from "./utils/TextEditorModules.js";

const ip = `172.25.36.80`;
const url = `http://${ip}:8080/api/v1/canvas`;
const awarenessUrl = `${url}/awareness`;

Quill.register('modules/cursors', QuillCursors);

const workspace_id = 1;
const conversation_id = 1;
const canvas_id = 3;

const TextEditor = () => {
    const quillRef = useRef(null);
    const [doc] = useState(new Y.Doc());

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const textType = doc.getText('quill-content');
        quill.getModule('cursors');
        const binding = new QuillBinding(textType, quill);

        const debouncedUpdateHandler = debounce(async () => {
            await postData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 250);

        const updateHandler = () => debouncedUpdateHandler();
        doc.on('update', updateHandler);

        const handleGetData = async () => {
            await getData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        };
        handleGetData();

        const dataInterval = setInterval(handleGetData, 250);

        return () => {
            clearInterval(dataInterval);
            doc.off('update', updateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel();
        };
    }, []);

    return (
        <div className={"w-full h-full overflow-hidden relative"}>
            <ReactQuill
                ref={quillRef}
                modules={modules}
                style={{ height: `100%`, maxHeight: `calc(100% - 27px)` }}
            />
        </div>
    );
};

export default TextEditor;
