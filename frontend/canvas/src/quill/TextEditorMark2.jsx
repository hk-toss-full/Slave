import { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import axios from 'axios';
import { modules } from './utils/TextEditorModules.js';
import { CustomInline } from './utils/CustomInLine.js';
import debounce from 'lodash.debounce'; // Ensure lodash.debounce is installed

const ip = `192.168.10.69`;
const url = `http://${ip}:8080`;

Quill.register(CustomInline);

const TextEditor = () => {
    const quillRef = useRef(null); // Quill instance reference
    const doc = new Y.Doc(); // Create Yjs document

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const textType = doc.getText('quill-content'); // Yjs text type

        // Synchronize Yjs document with Quill editor
        const binding = new QuillBinding(textType, quill);

        // Debounced update handler
        const debouncedUpdateHandler = debounce(async () => {
            const update = Y.encodeStateAsUpdate(doc);
            await axios.post(`${url}/update`, update, {
                headers: { 'Content-Type': 'application/octet-stream' }
            });
        }, 250);

        // Listen for document updates
        const updateHandler = () => debouncedUpdateHandler();
        doc.on('update', updateHandler);

        // Fetch latest state from the server
        const fetchUpdates = async () => {
            try {
                const response = await axios.get(`${url}/get-latest-updates`);

                // Decode Base64 to Uint8Array
                const update = new Uint8Array(
                    atob(response.data).split("").map(char => char.charCodeAt(0))
                );

                Y.applyUpdate(doc, update);
            } catch (error) {
                console.error("Failed to fetch updates:", error);
            }
        };

        fetchUpdates(); // Run once on initial load

        const interval = setInterval(fetchUpdates, 500); // Check server every 0.5 seconds

        return () => {
            clearInterval(interval);
            doc.off('update', updateHandler);
            binding.destroy();
            debouncedUpdateHandler.cancel(); // Cancel debounced function on cleanup
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
