// src/pages/WorkspaceListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useRecoilState, useRecoilValue} from "recoil";
import {EmailState} from "../stores/Atom.jsx";
import api from '../api/axios';

function WorkspaceListPage() {
    const navigate = useNavigate();
    const email = useRecoilValue(EmailState);
    const [workspaces, setWorkspaces] = useState([])


    useEffect(() => {
        const fetchWorkspaces = async () => {
            const userId = localStorage.getItem('userId');
            const response = await api.get(`/workspace/list?userId=${userId}`);
            console.log(response.data);
            setWorkspaces(response.data);
        };
        fetchWorkspaces();
    }, []);

    const goToCreateWorkspace = () => {
        navigate('/workspace/create');
    };

    return (
        <div className={"w-full min-h-full bg-[#4a154b]"}>
            <div className={"w-full justify-center flex flex-wrap text-white"}>
                <h1>워크스페이스 목록</h1>

                <div className={"w-full"}></div>
                <div className={"w-full h-12"}></div>
                <h1 className={"text-[26px]"}>Slave</h1>
                <div className={"w-full h-10"}></div>
                <div className={"text-[48px] font-bold"}>{`다시 만나게 되서 반가워요`}</div>
                <div className={"w-full h-6"}></div>
                {/* 기존 워크스페이스 목록을 불러오는 UI */}
                <div className={"w-[900px] border-solid border-4 rounded-[9px] text-black mb-12"}
                     style={{borderColor: `rgba(255, 255, 255, .2)`}}>
                    <div
                        className={"w-full h-[82px] bg-[#ecdeec] rounded-t-[5px] flex justify-between items-center p-4 text-[18px]"}>{email}의
                        워크스페이스
                    </div>
                    {workspaces.map((workspace, index) => {
                        console.log(workspace)
                        console.log(workspaces)
                        // eslint-disable-next-line react/jsx-key
                        return <div
                            className={`w-full h-[107px] bg-white ${index === workspaces.length - 1 && `rounded-b-[5px]`} flex items-center justify-between p-4`}>
                            <span>{workspace.workspaceName}</span>
                            <button onClick={() => navigate('/app')}
                                    className={"w-[158px] h-[52px] bg-[#4A154B] rounded-[4px] text-white text-[14px]"}>
                                워크스페이스 입장
                            </button>
                        </div>
                    })

                    }

                </div>
                <div className={"w-[900px] border-solid border-4 rounded-[9px]"}
                     style={{borderColor: `rgba(255, 255, 255, .2)`}}>
                    <div
                        className={"w-full h-[90px] bg-white rounded-[5px] text-black flex items-center justify-between p-4"}>
                        <span>다른 팀과 Slave을 사용하고 싶으세요?</span>
                        <button onClick={() => navigate('/workspace/create')}
                                className={"w-[158px] h-[52px] border-[#4A154B] border-2 rounded-[4px] text-[14px]"}>새
                            워크스페이스 개설
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceListPage;