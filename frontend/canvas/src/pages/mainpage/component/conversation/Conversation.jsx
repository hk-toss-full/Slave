import { ConversationTitleBar } from "./component/ConversationTitleBar.jsx";
import { ConversationMenubar } from "./component/ConversationMenubar.jsx";
import { ConversationBar } from "./component/ConversationBar.jsx";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import {ConversationNameState, ConversationState} from "../../../../stores/Atom.jsx";

export const Conversation = () => {
    const [conversationId, setConversationId] = useRecoilState(ConversationState);
    const [showMenubar, setShowMenubar] = useState(true);
    const [conversationName, setConversationName] = useRecoilState(ConversationNameState)

    useEffect(() => {
        setShowMenubar(false);  // 언로드
        const timer = setTimeout(() => {
            setShowMenubar(true);  // 0.2초 후 다시 로드
        }, 300);

        // 클린업 함수로 타이머 제거
        return () => clearTimeout(timer);
    }, [conversationId]);

    return (
        <>
            <ConversationBar />
            <div className={"w-full h-full max-h-full"} style={{ maxWidth: `calc(100% - 260px)` }}>
                {showMenubar && <>
                    <ConversationTitleBar title={conversationName} />
                    <ConversationMenubar />
                </>}
            </div>
        </>
    );
};
