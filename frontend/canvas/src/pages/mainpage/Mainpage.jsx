import {Toolbar} from "./component/Toolbar.jsx";
import {Workspace} from "./component/workspace/Workspace.jsx";

export const Mainpage = () => {
    return (
        <div className={"flex h-full w-full flex-wrap"}>
            <Toolbar/>
            <div className={"w-full"}></div>
            <Workspace/>
        </div>
    )
}