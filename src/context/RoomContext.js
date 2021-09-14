import React,{ createContext,useEffect,useState, useContext } from 'react';
import { database } from '../misc/config';
import { transformArrayWithId } from '../misc/helper';

const RoomContext = createContext();

export const RoomProvider = ({children})=>{
   const [room,setRoom] = useState(null);
   useEffect(()=>{
        const roomListRef = database.ref('rooms');
        roomListRef.on('value',(snap)=>{
            const data = transformArrayWithId(snap.val());
            setRoom(data);
        })
        return ()=>{
            roomListRef.off();
        }
   },[]);
    return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>
}   

export const useRooms = ()=> useContext(RoomContext)