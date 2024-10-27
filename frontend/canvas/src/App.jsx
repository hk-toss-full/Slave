import TextEditor from "./quill/TextEditor.jsx";
import TextEditorMark2 from "./quill/TextEditorMark2.jsx";
const App = () => {

    return (
        <div className={"flex h-full w-full flex-wrap"}>
            <div className={"w-full h-10 pr-1 bg-[#3B083C]"}></div>
            <div className={"w-full"}></div>
            <div
                className={"w-12 pt-[10px] h-full bg-[#3B083C]"}
                style={{maxHeight: `calc(100% - 40px)`}}>
            </div>
            <div className={"left-12 w-full h-full bg-[#3B083C] flex flex-wrap pr-1 pb-1"}
                 style={{maxWidth: `calc(100% - 48px)`,maxHeight: `calc(100% - 40px)`}}>
                <div className={"w-full bg-white rounded-r flex"}>
                    <div
                        className={"w-[260px] pt-5 pl-5 pr-2 bg-[#5D2D5F] h-full flex"}>
                    </div>
                    <div className={"w-full h-full max-h-full"}
                         style={{maxWidth: `calc(100% - 260px)`}}>
                        <div className={"w-full h-[49px] pl-5 pr-3"}></div>
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
                                <TextEditorMark2/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Message workspaceId={2} channelId={1}/>
        </div>
    )
}

export default App