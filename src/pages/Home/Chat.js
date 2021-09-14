import React from 'react'
import { useParams } from 'react-router'
import { Loader } from 'rsuite'
import Bottom from '../../components/chat-window/bottum'
import Messages from '../../components/chat-window/messages'
import Top from '../../components/chat-window/top'
import { CurrentRoomProvider } from '../../context/CurrentRoomContext'
import { useRooms } from '../../context/RoomContext'
import { auth } from '../../misc/config'
import { transformToArray } from '../../misc/helper'

function Chat() {
    const {chatid} = useParams();
    const rooms = useRooms();
    if(!rooms){
        return <Loader center vertical size="md" content="loading" speed="slow" />
    }
    const currentRooms = rooms.find(room=>room.id === chatid);

    if(!currentRooms){
       return <h6 className="text-center mt-page">chat {chatid} is not found !</h6>
    }
    const {name, description} = currentRooms;
    const admins = transformToArray(currentRooms.admins);
    const isAdmin = admins.includes(auth.currentUser.uid);
    const currntRoomData = {
        name,
        description,
        admins,
        isAdmin,
    }
    return (
        <CurrentRoomProvider data={currntRoomData}>
            <div className="chat-top">
                <Top/>
            </div>
            <div className="chat-middle">
                <Messages/>
            </div>
            <div className="chat-bottom">
                <Bottom/>
            </div>
        </CurrentRoomProvider>
    )
}

export default Chat
