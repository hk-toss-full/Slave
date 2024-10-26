import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { getData, postData } from "./utils/Data.js";
import { modules } from "./utils/TextEditorModules.js";
import { Awareness } from 'y-protocols/awareness';
import {use} from "marked";

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
    const [awareness] = useState(new Awareness(doc));

    useEffect(() => {
        const quill = quillRef.current.getEditor();

        // Initialize cursors module
        const cursors = quill.getModule('cursors');

        // QuillBinding for binding Y.Text and Quill
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

        // Handle quill selection changes
        quill.on('selection-change', range => {
            if (range) {
                awareness.setLocalStateField('user', {
                    ...awareness.getLocalState().user,
                    range,
                });
                sendCursorDataToServer();
            }
        });

        // Function to send cursor data to the server using axios
        const sendCursorDataToServer = debounce(async () => {
            try {
                const localState = awareness.getLocalState().user;
                await axios.post(`${url}/cursor`, {
                    cursor: localState
                }, {headers: {
                        'workspace_id': `${workspace_id}`,
                        'conversation_id': `${conversation_id}`,
                        'canvas_id': `${canvas_id}`,
                        'user_id': `${userID}`}});
            } catch (error) {
                console.error('Failed to send cursor data:', error);
            }
        }, 250);

        // Function to get cursor data from the server
        const getCursorDataFromServer = async () => {
            try {
                const response = await axios.get(`${url}/cursor/${workspace_id}/${conversation_id}/${canvas_id}`);
                const remoteCursors = response.data;
                let cursorJson = [];
                response.data.forEach(str => {
                    cursorJson.push(JSON.parse(str))
                })

                cursorJson.forEach(cursor => {
                    if (cursor.user_id !== userID) {
                        cursors.createCursor(cursor.user_id, cursor.cursor.name, cursor.cursor.color);
                        cursors.moveCursor(cursor.user_id, cursor.cursor.range);
                    }
                });
            } catch (error) {
                console.error('Failed to get cursor data:', error);
            }
        };

        // Set interval to periodically get cursor data from the server
        const cursorDataInterval = setInterval(getCursorDataFromServer, 1000);

        // Handle document updates and post data to the server
        const debouncedUpdateHandler = debounce(async () => {
            await postData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        }, 250);

        const updateHandler = () => debouncedUpdateHandler();
        doc.on('update', updateHandler);

        const handleGetData = async () => {
            await getData(url, workspace_id, conversation_id, canvas_id, doc, Y);
        };
        handleGetData();

        const dataInterval = setInterval(handleGetData, 1000);

        return () => {
            clearInterval(dataInterval);
            clearInterval(cursorDataInterval);
            doc.off('update', updateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel();
            sendCursorDataToServer.cancel();
        };
    }, [doc, awareness]);

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
