import HomeIcon from "../img/homeicon.jsx";

export const WorkspaceBar = () => {
    return (
        <div className={"flex flex-col items-center justify-center"}>
            <div className="w-9 h-9 bg-[#DDDDDD] rounded-[8px] mb-2 flex justify-center items-center text-[24px] font-black">T</div>
            <div className="w-full h-0 mb-2"></div>
            <div
                className="w-[52px] h-[68px] pt-2 pb-2 rounded-[6px] flex-wrap flex items-center justify-center">
                <div
                    className={"w-9 h-9 rounded-lg  flex justify-center items-center hover:bg-workspace-rgba duration-300"}>
                    <div className={"w-5 h-5"}><HomeIcon></HomeIcon></div>

                </div>
                <div className={"w-full"}></div>
                <div className={"text-[11px] text-white"}>홈</div>
            </div>
        </div>
    )
}