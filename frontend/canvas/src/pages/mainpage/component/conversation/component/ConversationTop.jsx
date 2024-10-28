import MessageFilter from "./img/MessageFilter.jsx";
import NewMessageIcon from "./img/NewMessageIcon.jsx";

export const ConversationTop = () => {
    return (
        <div className={"w-full h-[49px] pl-3 pr-2 flex items-center justify-center"}>
            <div
                className={"h-[30px] w-[167px] pt-[3px] pl-2 pb-[3px] pr-2 text-[18px] text-white font-black hover:bg-conversation-rgba duration-300 rounded-[6px]"}>워크스페이스
            </div>
            <div
                className={"w-9 h-9 hover:bg-conversation-rgba duration-300 rounded-lg flex justify-center items-center"}>
                <div className={"w-5 h-5"}>
                    <MessageFilter/>
                </div>
            </div>
            <div
                className={"w-9 h-9 hover:bg-conversation-rgba duration-300 rounded-lg flex justify-center items-center"}>
                <div className={"w-5 h-5"}>
                    <NewMessageIcon/>
                </div>
            </div>
        </div>
    )
}