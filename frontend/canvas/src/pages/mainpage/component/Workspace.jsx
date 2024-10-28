import {Conversation} from "./Conversation.jsx";

export const Workspace = () => {
    return (
        <>
            <div
                className={"w-12 pt-[10px] h-full bg-[#3B083C]"}
                style={{maxHeight: `calc(100% - 40px)`}}>
            </div>
            <div className={"left-12 w-full h-full bg-[#3B083C] flex flex-wrap pr-1 pb-1"}
                 style={{maxWidth: `calc(100% - 48px)`, maxHeight: `calc(100% - 40px)`}}>
                <div className={"w-full bg-white rounded-r flex"}>
                    <Conversation/>
                </div>
            </div>
        </>
    )
}