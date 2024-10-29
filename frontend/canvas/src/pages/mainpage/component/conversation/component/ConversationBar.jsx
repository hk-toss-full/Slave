import {useEffect, useState} from "react";
import {ConversationTop} from "./ConversationTop.jsx";
import {ShopIcon} from "./img/ShopIcon.jsx";
import ConversationList from "../../../../../components/ConversationList.jsx";
import {useRecoilState} from "recoil";
import {
    ConversationListState,
    ConversationNameState,
    ConversationState,
    WorkspaceState
} from "../../../../../stores/Atom.jsx";
import api from "../../../../../api/axios.js";

export const ConversationBar = () => {
    const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
    const [showChannelPopup, setShowChannelPopup] = useState(false);
    const [conversationDropdownData, setconversationDropdownData] = useRecoilState(ConversationListState);
    const [workspace_id, setWorkspace_id] = useRecoilState(WorkspaceState)
    const [conversationName, setConversationName] = useRecoilState(ConversationNameState)

    const [conversationId, setConversationId] = useRecoilState(ConversationState)

    const [isDMDropdownOpen, setIsDMDropdownOpen] = useState(false);
    const [showDMPopup, setShowDMPopup] = useState(false);



    const toggleChannelDropdown = () => {
        setIsChannelDropdownOpen(!isChannelDropdownOpen);
    };

    const handleChannelClick = () => {
        setShowChannelPopup(!showChannelPopup);
    };

    const toggleDMDropdown = () => {
        setIsDMDropdownOpen(!isDMDropdownOpen);
    };

    const handleDMClick = () => {
        setShowDMPopup(!showDMPopup);
    };

    const handleConversation = (conversationId) => {
        console.log(conversationId);
        setConversationId(conversationId);
    };

    const handleConversationName = (conversationName) => {
        setConversationName(conversationName);
    };

    return (
        <>
            <div className={"w-[260px] bg-[#5D2D5F] h-full"}>
                <ConversationTop/>
                <ConversationList workspaceId={workspace_id} />
                <div>
                    <div className={"w-full h-3"}></div>
                </div>
                <div>
                    <div className={"w-full pl-2 pr-2"}>
                        <div className={"h-7 w-full pl-2 pr-4 flex items-center cursor-pointer"}>
                            <span
                                className={`text-white duration-300 ${isChannelDropdownOpen ? `rotate-0` : `-rotate-90`} to-gray-50`}
                                onClick={toggleChannelDropdown}
                            >▼</span>
                            <div className="rounded-lg ml-2 pl-2 pr-2 hover:bg-conversation-rgba relative group"
                                 onClick={handleChannelClick}>
                                <span className="text-white">채널 </span>
                                <span className="text-transparent group-hover:text-white duration-300">▼</span>
                                {showChannelPopup && (
                                    <div
                                        className="absolute top-full w-[150px] left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 p-2 z-10 text-[15px]">
                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">생성
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* 드롭다운 메뉴 */}
                        {isChannelDropdownOpen && (
                            <div className={"mt-1 rounded-lg text-white"}>
                                {conversationDropdownData.map(item => {
                                    if(item.conversationType === 1){
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <div
                                                className="px-4 py-2 hover:bg-conversation-rgba rounded-lg cursor-pointer flex items-center"
                                                onClick={() => {
                                                    handleConversation(item.conversationId)
                                                    handleConversationName(item.conversationName)
                                                }
                                            }
                                            >
                                                <div className={"w-4 h-4"}>{<ShopIcon/>}</div>
                                                <p className={"ml-2"}>{item.conversationName}</p>
                                            </div>
                                        )
                                    }
                                    }
                                )}
                            </div>
                        )}
                    </div>
                    <div className={"w-full pl-2 pr-2 mt-2"}>
                        <div className={"h-7 w-full pl-2 pr-4 flex items-center cursor-pointer"}>
                            <span
                                className={`text-white duration-300 ${isDMDropdownOpen ? `rotate-0` : `-rotate-90`} to-gray-50`}
                                onClick={toggleDMDropdown}
                            >▼</span>
                            <div className="rounded-lg ml-2 pl-2 pr-2 hover:bg-conversation-rgba relative group"
                                 onClick={handleDMClick}>
                                <span className="text-white">다이렉트 메시지 </span>
                                <span className="text-transparent group-hover:text-white duration-300">▼</span>
                                {showDMPopup && (
                                    <div
                                        className="absolute top-full w-[150px] left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 p-2 z-10 text-[15px]">
                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">생성
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {isDMDropdownOpen && (
                            <div className={"mt-1 rounded-lg text-white"}>
                                {conversationDropdownData.map(item => {
                                    if(item.conversationType === 2){
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <div
                                                className="px-4 py-2 hover:bg-conversation-rgba rounded-lg cursor-pointer flex items-center"
                                                onClick={() => {
                                                    handleConversation(item.conversationId)
                                                    handleConversationName(item.conversationName)
                                                }
                                                }
                                            >
                                                <div className={"w-4 h-4"}></div>
                                                <p className={"ml-2"}>{item.conversationName}</p>
                                            </div>
                                        )
                                    }}
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
