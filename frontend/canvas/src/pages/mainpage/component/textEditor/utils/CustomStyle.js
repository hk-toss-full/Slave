import {Quill} from "react-quill";

const Inline = Quill.import('blots/inline');

export class CustomStyle extends Inline {
    static create(value) {
        let node = super.create();
        node.setAttribute('class', value); // 여기에 원하는 클래스를 추가할 수 있습니다.
        return node;
    }
    static formats(node) {
        return node.getAttribute('class');
    }
}
CustomStyle.blotName = 'custom';
CustomStyle.tagName = 'span'; // 인라인 요소로 감싸기 위해 span을 사용
CustomStyle.className = 'custom';

const BlockEmbed = Quill.import('blots/block/embed');

export class Separator extends BlockEmbed {
    static create() {
        const node = super.create();
        node.classList.add('custom-hr'); // 커스텀 클래스를 추가해 스타일 적용
        return node;
    }
}
Separator.blotName = 'custom-hr';
Separator.tagName = 'hr';