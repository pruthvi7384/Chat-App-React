import React,{ useRef,useState,useEffect } from 'react'
import { Divider } from 'rsuite'
import CreateChatRoomBtn from './CreateChatRoomBtn'
import DashboardToggle from './dashboard/DashboardToggle'
import ChatRoomList from './rooms/ChatRoomList'

function Sidebar() {
    const toSideBarRef = useRef();
    const [height,setHeight] = useState(0);
    useEffect(() => {
        if(toSideBarRef.current){
            setHeight(toSideBarRef.current.scrollHeight);
        }
    },[toSideBarRef])
    return (
        <div className="h-100 pt-2">
            <div ref={toSideBarRef}>
                <DashboardToggle/>
                <CreateChatRoomBtn/>
                <Divider>Join Conversation</Divider>
            </div>
            <ChatRoomList aboveElementHeight={height} />
        </div>
    )
}

export default Sidebar
