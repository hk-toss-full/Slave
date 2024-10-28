import TextEditorMark3 from "./textEditor/TextEditor.jsx";

export const ConversationMenubar = () => {
    return (
        <>
            <div className={"w-full h-[38px] pl-4 pr-3 border-b border-[#DDDDDD] flex"}>
                <div className={"h-full p-2 border-b-2 border-[#83388A] text-center"}>
                    <p>메시지</p>
                </div>
                <div className={"h-full p-2 border-b-2 text-center"}>
                    <p>캔버스</p>
                </div>
                <div
                    className={"h-full w-[32px] p-2 text-center text-[30px] border-b-2 border-white relative"}>
                    <p className={"absolute -top-[6px]"}>+</p></div>
            </div>
            <div className="flex min-h-0 w-full h-full" style={{maxHeight: `calc(100vh - 130px)`}}>
                <div className={"w-full flex h-full"}>
                    <TextEditorMark3/>
                </div>
            </div>
        </>
    )
}