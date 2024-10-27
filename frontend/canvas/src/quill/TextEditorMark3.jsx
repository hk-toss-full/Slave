import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import debounce from 'lodash.debounce';
import { getData, postData } from "./utils/Data.js";
import { modules } from "./utils/TextEditorModules.js";
import { Awareness } from 'y-protocols/awareness';
import {getCursor, postCursor} from "./utils/Cursor.js";
import {CustomStyle, Separator} from "./utils/CustomStyle.js";
import {EventKey} from "./utils/EventKey.js";

const ip = `172.25.36.80`;
const url = `http://${ip}:8080/api/v1/canvas`;
const awarenessUrl = `${url}/awareness`;

Quill.register('modules/cursors', QuillCursors);
Quill.register(CustomStyle, true);
Quill.register(Separator);
const workspace_id = 1;
const conversation_id = 1;
const canvas_id = 3;

const TextEditor = () => {
    const quillRef = useRef(null);
    const [doc] = useState(new Y.Doc());
    const [awareness] = useState(new Awareness(doc));

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const cursors = quill.getModule('cursors');
        const textType = doc.getText('quill-content');
        const binding = new QuillBinding(textType, quill, awareness);

        // Awareness update for handling user presence and cursors
        awareness.on('change', () => {
            awareness.getStates().forEach((state, clientID) => {
                if (clientID !== doc.clientID) {
                    cursors.createCursor(clientID, state.user.name, state.user.color);
                    cursors.moveCursor(clientID, state.user.range);
                }
            });
        });

        // Example of setting awareness for the current user (assuming a unique user ID and color)
        const userID = `user-${Math.floor(Math.random() * 1000)}`; // Replace with real user info if available
        awareness.setLocalStateField('user', {
            name: userID,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
            range: quill.getSelection(),
        });

        // 커서 정보 발송
        const handlePostCursor = async () => {
            await postCursor(url, workspace_id, conversation_id, canvas_id ,userID, awareness)
        }

        // 변경시마다 실행
        quill.on('selection-change', range => {
            if (range) {
                awareness.setLocalStateField('user', {
                    ...awareness.getLocalState().user,
                    range,
                });
                handlePostCursor();
            }
        });

        // 커서 정보 요청
        const handleGetCursor = async () => {
            await getCursor(url, workspace_id, conversation_id, canvas_id, userID, cursors)
        }
        // 커서 요청 반복
        const cursorDataInterval = setInterval(handleGetCursor, 1000);

        // 텍스트 발송
        const debouncedUpdateHandler = debounce(async () => {
            await postData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 250);

        const updateHandler = () => debouncedUpdateHandler();
        doc.on('update', updateHandler);

        // 텍스트 요청
        const handleGetData = async () => {
            await getData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        };
        // 최초 로딩
        handleGetData();

        const dataInterval = setInterval(handleGetData, 1000);

        return () => {
            clearInterval(dataInterval);
            clearInterval(cursorDataInterval);
            doc.off('update', updateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel();
            postCursor.cancel();
        };
    }, [doc, awareness]);

    const handleEventKey = (event) => {
        EventKey(event, quillRef)
    }

    document.addEventListener('keydown', handleEventKey);

    return (
        <div className={"w-full h-full overflow-hidden relative"}>
            <ReactQuill
                ref={quillRef}
                modules={{
                    ...modules,
                    cursors: {
                        transformOnTextChange: true,
                    },
                }}
                style={{ height: `100%`, maxHeight: `calc(100% - 27px)` }}
            />
        </div>
    );
};

export default TextEditor;
