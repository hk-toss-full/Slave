import {ConversationTitleBar} from "../ConversationTitleBar.jsx";
import {ConversationMenubar} from "../ConversationMenubar.jsx";
import NewMessageIcon from "./component/img/NewMessageIcon.jsx";

export const Conversation = () => {
    return (
        <>
            <div
                className={"w-[260px] bg-[#5D2D5F] h-full flex"}>
                <div className={"w-full h-[49px] pl-3 pr-2 flex items-center justify-center"}>
                    <div className={"h-[30px] w-[167px] pt-[3px] pl-2 pb-[3px] pr-2 text-[18px] text-white font-black"}>워크스페이스
                    </div>
                    <div className={"w-9 h-9 rounded-lg"} style={{backgroundColor: `rgba(249, 237, 255, 0.08)`}}></div>
                    <div className={"w-9 h-9 bg-white rounded-lg flex justify-center items-center"} style={{backgroundColor: `rgba(249, 237, 255, 0.08)`}}>
                        <div className={"w-5 h-5"}>
                            <NewMessageIcon/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-full h-full max-h-full"}
                 style={{maxWidth: `calc(100% - 260px)`}}>
                <ConversationTitleBar/>
                <ConversationMenubar/>
            </div>
        </>
    )
}