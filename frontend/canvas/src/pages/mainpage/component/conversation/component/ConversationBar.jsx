import {useState} from "react";
import {ConversationTop} from "./ConversationTop.jsx";
import {ShopIcon} from "./img/ShopIcon.jsx";
import {HiddenIcon} from "./img/HiddenIcon.jsx";
import ConversationList from "../../../../../components/ConversationList.jsx";

export const ConversationBar = () => {
    const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
    const [showChannelPopup, setShowChannelPopup] = useState(false);
    const [ChannelDropdownData, setChannelDropdownData] = useState([
        {title: '공지사항', status: true},
        {title: '일반', status: false},
        {title: '한경프론트엔드', status: true},
        {title: '공지사항', status: true},
        {title: '공지사항', status: true},
        {title: '공지사항', status: true},
        {title: '공지사항', status: true}
    ]); // 드롭다운 데이터를 위한 상태

    const [isDMDropdownOpen, setIsDMDropdownOpen] = useState(false);
    const [showDMPopup, setShowDMPopup] = useState(false);
    const [DMDropdownData, setDMDropdownData] = useState(['조경준', '김예은', '최승혁', '이승진']);

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

    return (
        <>
            <div className={"w-[260px] bg-[#5D2D5F] h-full"}>
                <ConversationTop/>
                <ConversationList workspaceId={1} />
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
                                {ChannelDropdownData.map(item => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <div
                                                className="px-4 py-2 hover:bg-conversation-rgba rounded-lg cursor-pointer flex items-center">
                                                <div className={"w-4 h-4"}>{item.status ? <ShopIcon/> : <HiddenIcon/>}</div>
                                                <p className={"ml-2"}>{item.title}</p>
                                            </div>
                                        )
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
                                {DMDropdownData.map(item => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <div
                                                className="px-4 py-2 hover:bg-conversation-rgba rounded-lg cursor-pointer flex items-center">
                                                <div className={"w-4 h-4"}></div>
                                                <p className={"ml-2"}>{item}</p>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
