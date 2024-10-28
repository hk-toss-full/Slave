export const EventKey = (event, quillRef) => {
    if (event.key === ' ') {
        const quillEditor = quillRef.current.getEditor();
        const selection = quillEditor.getSelection();
        const index = selection.index;
        if (selection && index > 0) {
            const text = quillEditor.getText(0, index).trim();
            //let newContent = editorContent;
            if (text.endsWith('###')) {
                event.preventDefault()
                quillEditor.deleteText(index - 3, 3);
                quillEditor.formatLine(index - 3, 1, 'header', '3');
            } else if (text.endsWith('##')) {
                event.preventDefault()
                quillEditor.deleteText(index - 2, 2);
                quillEditor.formatLine(index - 2, 1, 'header', '2');
            } else if (text.endsWith('#')) {
                event.preventDefault()
                quillEditor.deleteText(index - 1, 1);
                quillEditor.formatLine(index - 1, 1, 'header', '1');
            } else if (text.endsWith('[]')) {
                quillEditor.deleteText(index - 2, 2);
                quillEditor.insertText(index - 2, '☐ ', 'bold', false);
            } else if (text.endsWith('>')) {
                event.preventDefault()
                quillEditor.deleteText(index - 1, 1); // '>'를 삭제
                const [line, offset] = quillEditor.getLine(index - 1);
                const lineIndex = quillEditor.getIndex(line);
                quillEditor.formatLine(lineIndex, line.length(), 'blockquote', true);
            }
        }
    } else if (event.key === '`') {
        const quillEditor = quillRef.current.getEditor();
        const selection = quillEditor.getSelection();
        const index = selection.index;
        if (selection && index > 0) {
            const text = quillEditor.getText(0,index).trim();
            console.log(text);
            if (text.endsWith('``')) {
                event.preventDefault()
                quillEditor.deleteText(index - 2, 2);
                quillEditor.formatLine(index - 2, 1, 'code-block',true);
            } else if (text.indexOf('`') !== -1 && !(text.endsWith('`'))) {
                const start = text.indexOf('`');
                console.log(text.indexOf('`'))
                event.preventDefault()
                console.log(text.length);
                quillEditor.deleteText(start, 1);
                quillEditor.formatText(start, text.length-start, 'custom', 'border-[#DDDDDD] rounded-[3px] border bg-[#F8F8F8] text-[#E01E5A] pl-[10px] pt-[5px] pr-[10px] pb-[5px] text-[13px] font-[ui-monospace]');
            }
        }
    } else if (event.key === '*') {
        const quillEditor = quillRef.current.getEditor();
        const selection = quillEditor.getSelection();
        if (selection && selection.index > 0) {
            const text = quillEditor.getText(0, selection.index).trim();
            const start = text.indexOf('*');
            if ( start !== -1 && !(text.endsWith('*'))) {
                event.preventDefault()
                quillEditor.deleteText(start, 1);
                quillEditor.formatText(start, text.length-start-1, 'bold', true);
            } else if (text.endsWith('**')) {
                event.preventDefault();
                const range = quillEditor.getSelection();
                if (range) {
                    quillEditor.deleteText(range.index - 2, 2);
                    quillEditor.insertEmbed(range.index - 2, 'custom-hr', `border-t border-[#ccc]`);
                }
            }


        }
    } else if (event.key === '~') {
        const quillEditor = quillRef.current.getEditor();
        const selection = quillEditor.getSelection();
        if (selection && selection.index > 0) {
            const text = quillEditor.getText(0, selection.index).trim();
            const start = text.indexOf('~');
            if ( start !== -1 && !(text.endsWith('~'))) {
                event.preventDefault()
                quillEditor.deleteText(start, 1);
                quillEditor.formatText(start, text.length-start-1, 'strike', true);
            }
        }
    } else if (event.key === '_') {
        const quillEditor = quillRef.current.getEditor();
        const selection = quillEditor.getSelection();
        if (selection && selection.index > 0) {
            const text = quillEditor.getText(0, selection.index).trim();
            const start = text.indexOf('_');
            console.log(text);
            if ( start !== -1 && !(text.endsWith('_'))) {
                event.preventDefault()
                console.log(text.length);
                quillEditor.deleteText(start, 1);
                quillEditor.formatText(start, text.length-start-1, 'italic', true);
            }
        }
    } else if (event.key === 'Enter') {
        const quillEditor = quillRef.current.getEditor();
        const range = quillEditor.getSelection(true);
        if (range) {
            const [line, offset] = quillEditor.getLine(range.index);
            const lineText = line.domNode.innerText.trim(); // 현재 라인의 텍스트를 가져옵니다.

            if (lineText === '') {
                const lineFormats = quillEditor.getFormat(range.index);

                if (lineFormats.blockquote) {
                    quillEditor.formatLine(range.index, 1, 'blockquote', false);
                }
            }
        }
    }
}