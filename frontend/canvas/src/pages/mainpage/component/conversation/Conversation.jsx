import {ConversationTitleBar} from "../ConversationTitleBar.jsx";
import {ConversationMenubar} from "../ConversationMenubar.jsx";
import {ConversationBar} from "./component/ConversationBar.jsx";

export const Conversation = () => {
    return (
        <>
            <ConversationBar/>
            <div className={"w-full h-full max-h-full"}
                 style={{maxWidth: `calc(100% - 260px)`}}>
                <ConversationTitleBar/>
                <ConversationMenubar/>
            </div>
        </>
    )
}