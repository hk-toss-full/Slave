import TextEditorMark3 from "../../textEditor/TextEditor.jsx";
import {Plus} from "./img/plus.jsx";
import {useState} from "react";
import Chat from "../../../../../chat/Chat.jsx";

export const ConversationMenubar = () => {
    const [isRotated, setIsRotated] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [Menu, setMenu] = useState([{title:'메시지', id:1},{title:'캔버스', id:1},]);
    const [selectMenu, setSelectMenu] = useState({title:'메시지', id:1});

    const handleClick = () => {
        setIsRotated(!isRotated);
        setShowPopup(!showPopup);
    };

    const addChat = () => {
        const addMenu = [...Menu, {title:'메시지', id:1}]
        setMenu(addMenu);
        setShowPopup(false);
    };

    const addCanvas = () => {
        const addCanvas = [...Menu, {title:'캔버스', id:1}]
        setMenu(addCanvas);
        setShowPopup(false);
    };

    const handleMenu = (menu) => {
        console.log(menu);
        setSelectMenu(menu);
    };

    return (
        <>
            <div className={"w-full h-[38px] pl-4 pr-3 border-b border-[#DDDDDD] flex relative"}>
                {Menu.map(item => {
                    return (
                        <div
                            key={item.title} // 키 설정
                            className={"h-full p-2 border-b-2 hover:border-[#83388A] duration-300 text-center"}
                            onClick={() => handleMenu(item)} // onClick 함수 수정
                        >
                            <p>{item.title}</p>
                        </div>
                    )
                })}
                <div
                    className={"h-full w-[32px] p-2 text-center text-[30px] border-b-2 border-white relative justify-center items-center"}>
                    <div
                        className={"hover:bg-convermenu-rgba duration-300 flex justify-center items-center w-7 h-7 rounded-full -mt-1"}>
                    <div onClick={handleClick}
                             className={`relative w-4 h-4 transition-transform duration-500 ${isRotated ? 'rotate-[225deg]' : 'rotate-0'}`}>
                            <Plus/>
                        </div>
                    </div>
                    {showPopup && (
                        <div
                            className="absolute top-full w-[150px] left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 p-2 z-10 text-[15px]">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={addChat}>메시지 추가</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={addCanvas}>캔버스 추가</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex min-h-0 w-full h-full" style={{maxHeight: `calc(100vh - 130px)`}}>
                <div className={"w-full flex h-full"}>
                    {selectMenu.title === '메시지' ? <Chat workspaceId={1} channelId={1} /> : <TextEditorMark3/> }
                </div>
            </div>
        </>
    );
};
