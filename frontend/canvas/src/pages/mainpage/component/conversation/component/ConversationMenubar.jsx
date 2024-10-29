import TextEditorMark3 from "../../textEditor/TextEditor.jsx";
import { Plus } from "./img/plus.jsx";
import { useState, useEffect } from "react";
import Chat from "../../../../../chat/Chat.jsx";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {CanvasState, ConversationState, WorkspaceState} from "../../../../../stores/Atom.jsx";

export const ConversationMenubar = () => {
    const [isRotated, setIsRotated] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [Menu, setMenu] = useState([{ title: "캔버스 1", id: 1}]);
    const [selectMenu, setSelectMenu] = useState({ title: "메시지", id: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [workspaceId]= useRecoilValue(WorkspaceState)
    const [conversationId]= useRecoilValue(ConversationState)
    const [canvasId, setcanvasId] = useRecoilState(CanvasState);

    const handleClick = () => {
        setIsRotated((prev) => !prev);
        setShowPopup((prev) => !prev);
    };

    const addCanvas = () => {
        const newCanvas = { title: `캔버스 ${Menu.length + 1}`, id: Menu.length + 1 };
        setMenu((prevMenu) => [...prevMenu, newCanvas]);
        setShowPopup(false);
    };

    const handleMenu = (menu) => {
        if(menu.title !== '메세지'){
            setcanvasId(menu.id)
        }
        if (menu.id !== selectMenu.id) {
            setIsLoading(true);
            setTimeout(() => {
                setSelectMenu(menu);
                setIsLoading(false);
            }, 300);
        }
    };

    useEffect(() => {
        if (!Menu.find((item) => item.id === selectMenu.id) && selectMenu.id !== 0) {
            setSelectMenu({ title: "메시지", id: 0 });
        }
    }, [Menu, selectMenu.id]);

    return (
        <>
            <div className={"w-full h-[38px] pl-4 pr-3 border-b border-[#DDDDDD] flex relative"}>
                <div
                    className={
                        "h-full p-2 border-b-2 hover:border-[#83388A] duration-300 text-center" +
                        (selectMenu.id === 0 ? " border-[#83388A]" : " border-transparent")
                    }
                    onClick={() => handleMenu({ title: "메시지", id: 0 })}
                >
                    <p>메시지</p>
                </div>
                {Menu.map((item) => (
                    <div
                        key={item.key}
                        className={
                            "h-full p-2 border-b-2 hover:border-[#83388A] duration-300 text-center" +
                            (selectMenu.id === item.id ? " border-[#83388A]" : " border-transparent")
                        }
                        onClick={() => handleMenu(item)}
                    >
                        <p>{item.title}</p>
                    </div>
                ))}
                <div
                    className={
                        "h-full w-[32px] p-2 text-center text-[30px] border-b-2 border-white relative justify-center items-center"
                    }
                >
                    <div
                        className={
                            "hover:bg-convermenu-rgba duration-300 flex justify-center items-center w-7 h-7 rounded-full -mt-1"
                        }
                    >
                        <div
                            onClick={handleClick}
                            className={`relative w-4 h-4 transition-transform duration-500 ${isRotated ? "rotate-[225deg]" : "rotate-0"}`}
                        >
                            <Plus />
                        </div>
                    </div>
                    {showPopup && (
                        <div className="absolute top-full w-[150px] left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 p-2 z-10 text-[15px]">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={addCanvas}
                            >
                                캔버스 추가
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex min-h-0 w-full h-full" style={{ maxHeight: `calc(100vh - 130px)` }}>
                <div className={"w-full flex h-full"}>
                    {isLoading ? (
                        <div className="w-full flex items-center justify-center">
                            <p>로딩 중...</p>
                        </div>
                    ) : selectMenu.id === 0 ? (
                        <Chat workspaceId={workspaceId} channelId={conversationId} />
                    ) : (
                        <TextEditorMark3 canvas_id={selectMenu.id}/>
                    )}
                </div>
            </div>
        </>
    );
};
