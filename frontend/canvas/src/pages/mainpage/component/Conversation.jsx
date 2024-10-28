import {ConversationTitleBar} from "./ConversationTitleBar.jsx";
import {ConversationMenubar} from "./ConversationMenubar.jsx";

export const Conversation = () => {
    return (
        <>
            <div
                className={"w-[260px] pt-5 pl-5 pr-2 bg-[#5D2D5F] h-full flex"}>
            </div>
            <div className={"w-full h-full max-h-full"}
                 style={{maxWidth: `calc(100% - 260px)`}}>
                <ConversationTitleBar/>
                <ConversationMenubar/>
            </div>
        </>
    )
}