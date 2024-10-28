import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import './utils/TextEditor.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import debounce from 'lodash.debounce';
import {getCanvas, postCanvas, sseCanvas} from "./utils/Canvas.js";
import { modules } from "./utils/TextEditorModules.js";
import { Awareness } from 'y-protocols/awareness';
import {postCursor, sseCursor} from "./utils/Cursor.js";
import {CustomStyle, Separator} from "./utils/CustomStyle.js";
import {EventKey} from "./utils/EventKey.js";

const ip = `192.168.10.69`;
const url = `http://${ip}:8080/api/v1/canvas`;

Quill.register('modules/cursors', QuillCursors);
Quill.register(CustomStyle, true);
Quill.register(Separator);
const workspace_id = 1;
const conversation_id = 1;
const canvas_id = localStorage.getItem('canvas_id') || 1 ;

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

        // Load user ID from localStorage or create a new one
        let userID = localStorage.getItem('userID');
        if (!userID) {
            userID = `user-${Math.floor(Math.random() * 1000)}`;
            localStorage.setItem('userID', userID);
        }
        sseCursor(url, workspace_id, conversation_id, canvas_id, cursors, userID);
        // Set awareness for the current user
        awareness.setLocalStateField('user', {
            name: userID,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
            range: quill.getSelection(),
        });

        // 커서 정보 발송
        const handlePostCursor = async () => {
            await postCursor(url, workspace_id, conversation_id, canvas_id ,userID, awareness)
        }

        // 변경시만붤
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
        // const handleGetCursor = async () => {
        //     await getCursor(url, workspace_id, conversation_id, canvas_id, userID, cursors)
        // }
        // 커서 요청 반복
        //const cursorDataInterval = setInterval(handleGetCursor, 1000);

        // 텍스트 발송
        const debouncedUpdateHandler = debounce(async () => {
            await postCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 250);

        const updateHandler = () => debouncedUpdateHandler();
        doc.on('update', updateHandler);

        // 텍스트 요청
        const handleGetData = async () => {
            await getCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);
        };
        // 최초 로딩
        handleGetData();

        sseCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);

        //const dataInterval = setInterval(handleGetData, 1000);

        return () => {
            //clearInterval(dataInterval);
            //clearInterval(cursorDataInterval);
            doc.off('update', updateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel();
            postCursor.cancel();
            eventSource.close();
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
