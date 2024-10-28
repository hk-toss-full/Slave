import TextEditorMark3 from "./textEditor/TextEditor.jsx";
import {Plus} from "./conversation/component/img/plus.jsx";
import {useState} from "react";

export const ConversationMenubar = () => {
    const [isRotated, setIsRotated] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = () => {
        setIsRotated(!isRotated);
        setShowPopup(!showPopup);
    };

    return (
        <>
            <div className={"w-full h-[38px] pl-4 pr-3 border-b border-[#DDDDDD] flex relative"}>
                <div className={"h-full p-2 border-b-2 border-[#83388A] text-center"}>
                    <p>메시지</p>
                </div>
                <div className={"h-full p-2 border-b-2 text-center"}>
                    <p>캔버스</p>
                </div>
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
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">메시지 추가</button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">캔버스 추가</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex min-h-0 w-full h-full" style={{maxHeight: `calc(100vh - 130px)`}}>
                <div className={"w-full flex h-full"}>
                    <TextEditorMark3/>
                </div>
            </div>
        </>
    );
};
