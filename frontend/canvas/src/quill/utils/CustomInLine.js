import {Quill} from "react-quill";

const Inline = Quill.import('blots/inline');

export class CustomInline extends Inline {
    static create(value) {
        let node = super.create();
        node.setAttribute('class', value); // 여기에 원하는 클래스를 추가할 수 있습니다.
        return node;
    }
    static formats(node) {
        return node.getAttribute('class');
    }
}
CustomInline.blotName = 'custom-inline';
CustomInline.tagName = 'span'; // 인라인 요소로 감싸기 위해 span을 사용
CustomInline.className = 'custom-inline-class';