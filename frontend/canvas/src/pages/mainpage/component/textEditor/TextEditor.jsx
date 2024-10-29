import { useEffect, useRef, useState, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import './utils/TextEditor.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import debounce from 'lodash.debounce';
import { getCanvas, postCanvas, sseCanvas } from './utils/Canvas.js';
import { modules } from './utils/TextEditorModules.js';
import { Awareness } from 'y-protocols/awareness';
import { postCursor, sseCursor } from './utils/Cursor.js';
import { CustomStyle, Separator } from './utils/CustomStyle.js';
import { EventKey } from './utils/EventKey.js';
import {useRecoilValue} from "recoil";
import {ConversationState, WorkspaceState} from "../../../../stores/Atom.jsx";

const ip = `localhost`;
const url = `http://${ip}:8080/api/v1`;

Quill.register('modules/cursors', QuillCursors);
Quill.register(CustomStyle, true);
Quill.register(Separator);

const TextEditor = ({canvas_id}) => {
    const quillRef = useRef(null);
    const [doc] = useState(new Y.Doc());
    const [awareness] = useState(new Awareness(doc));
    const [workspace_id] = useRecoilValue(WorkspaceState)
    const [conversation_id] = useRecoilValue(ConversationState)

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const cursors = quill.getModule('cursors');
        const textType = doc.getText('quill-content');
        const binding = new QuillBinding(textType, quill, awareness);

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
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            range: quill.getSelection(),
        });

        // Cursor information dispatch
        const handlePostCursor = debounce(() => {
            postCursor(url, workspace_id, conversation_id, canvas_id, userID, awareness);
        }, 250);

        // Handle selection change
        const handleSelectionChange = (range) => {
            if (range) {
                awareness.setLocalStateField('user', {
                    ...awareness.getLocalState().user,
                    range,
                });
                handlePostCursor();
            }
        };

        quill.on('selection-change', handleSelectionChange);

        // Text dispatch
        const debouncedUpdateHandler = debounce(() => {
            postCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 250);

        doc.on('update', debouncedUpdateHandler);

        // Initial data loading
        const handleGetData = async () => {
            await getCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);
        };
        handleGetData();

        sseCanvas(url, workspace_id, conversation_id, canvas_id, doc, Y);

        return () => {
            quill.off('selection-change', handleSelectionChange);
            doc.off('update', debouncedUpdateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel();
            handlePostCursor.cancel();
        };
    }, [doc, awareness]);

    const handleEventKey = useCallback((event) => {
        EventKey(event, quillRef);
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleEventKey);
        return () => {
            document.removeEventListener('keydown', handleEventKey);
        };
    }, [handleEventKey]);

    return (
        <div className={'w-full h-full overflow-hidden relative'}>
            <ReactQuill
                ref={quillRef}
                modules={{
                    ...modules,
                    cursors: {
                        transformOnTextChange: true,
                    },
                }}
                style={{ height: '100%', maxHeight: 'calc(100% - 27px)' }}
            />
        </div>
    );
};

export default TextEditor;
