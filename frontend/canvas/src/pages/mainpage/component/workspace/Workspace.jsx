import {Conversation} from "../conversation/Conversation.jsx";
import {WorkspaceBar} from "./component/WorkspaceBar.jsx";

export const Workspace = () => {
    return (
        <>
            <div
                className="w-[70px] pt-2 h-full bg-[#3B083C]"
            >
            <WorkspaceBar/>
            </div>
            <div className={"left-12 w-full h-full bg-[#3B083C] flex flex-wrap pr-1 pb-1"}
                 style={{maxWidth: `calc(100% - 70px)`, maxHeight: `calc(100% - 40px)`}}>
                <div className={"w-full bg-white rounded-r-lg flex"}>
                    <Conversation/>
                </div>
            </div>
        </>
    )
}