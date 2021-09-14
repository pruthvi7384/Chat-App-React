import React,{ useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/config';
import { groupBy, transformArrayWithId } from '../../../misc/helper';
import MessageIteam from './MessageIteam';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

const shouldScrollToButton = (node,threshold = 30)=>{
    const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

    return percentage > threshold;
}

function Messages() {
    const {chatid} = useParams();
    const [messages,setMessages] = useState(null);
    const [limit,setLimit] = useState(PAGE_SIZE);
    const selfRef = useRef();
    const isChatEmpty = messages && messages.length === 0;
    const canShowMessage = messages && messages.length > 0;
    const loadMesssages = useCallback((limitToLast)=>{
        const node = selfRef.current;
        messagesRef.off();
        messagesRef.orderByChild('roomId').equalTo(chatid).limitToLast(limitToLast || PAGE_SIZE).on('value', (snap)=>{
            const data = transformArrayWithId(snap.val());
            setMessages(data);
            if(shouldScrollToButton(node)) {
                node.scrollTop = node.scrollHeight;
            }
        });
        setLimit(p => p + PAGE_SIZE);
    },[chatid]);

    const onLoadMore = useCallback(()=>{
        const node  =selfRef.current;
        const oldHeight = node.scrollHeight;
        loadMesssages(limit);
        setTimeout(()=>{
            const newHeight = node.scrollHeight;
            node.scrollTop = newHeight - oldHeight
        },200)
    },[limit,loadMesssages]);

    useEffect(() => {
        const node  =selfRef.current;
        loadMesssages();
        setTimeout(() =>{
            node.scrollTop = node.scrollHeight;
        },200)
         return ()=>{
            messagesRef.off('value')
        }
    },[loadMesssages]);
    const handleAdminGrant= useCallback(async (uid)=>{
        const adminsRef = database.ref(`/rooms/${chatid}/admins`);
        let alertMsg;
        await adminsRef.transaction(admins=>{
            if (admins) {
                if (admins[uid]) {
                    admins[uid] = null;
                    alertMsg = 'Admin Permission Removed !';
                } else {
                    admins[uid]=true;
                    alertMsg = 'Admin Permission Granted !';
                }
              }
              return admins;
        });
        Alert.info(alertMsg, 4000);
    },[chatid]);

    const handleLike = useCallback( async (msgid)=>{
        const {uid} = auth.currentUser;
        const messageRef = database.ref(`/messages/${msgid}`);
        let alertMsg;
        await messageRef.transaction(msg=>{
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likeCount -= 1;
                    msg.likes[uid] = null;
                    alertMsg = 'Liked Removed!';
                } else {
                    msg.likeCount += 1;
                    if(!msg.likes){
                        msg.likes = {};
                    }
                    msg.likes[uid]=true;
                    alertMsg = 'Likes Added!';
                }
              }
              return msg;
        });
        Alert.info(alertMsg, 4000);
    },[])
   const handaleDelete = useCallback(async (msgid,file)=>{
        if(!window.confirm('Delete This Message?')){
            return;
        }
        const isLast = messages[messages.length - 1].id === msgid;
        const updates = {};
        updates[`/messages/${msgid}`] = null;
        if(isLast && messages.length > 1){
            updates[`/rooms/${chatid}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgid: messages[messages.length -2].id
            }
        }
        if(isLast && messages.length === 1){
            updates[`/rooms/${chatid}/lastMessage`] = null;
        }
        try{
            await database.ref().update(updates);
            Alert.info('Message Has been deleted', 4000);
        }catch(e){
          return Alert.error(e.message,4000);
        }
        if(file){
            try{
                const fileRef = storage.refFromURL(file.url);
                await fileRef.delete();
            }catch(e){
                Alert.error(e.message,4000);
            }
        }
       
   },[chatid, messages]);
   const renderMessages = ()=>{
       const groups  = groupBy(messages,(item)=>new Date(item.createdAt).toDateString());
       let items = [];
       Object.keys(groups).forEach((date)=>{
            items.push(<li key={date} className="text-center mb-1 padded">{date}</li>);
            const msags = groups[date].map((msg)=>(
               <MessageIteam key={msg.id} message={msg} handleAdminGrant={handleAdminGrant} handleLike={handleLike} handaleDelete={handaleDelete} />
            ));
            items.push(...msags);
       });
       return items;
   }
    return (
        <ul ref={selfRef} className="msg-list custom-scroll">
            {messages && messages.length >= PAGE_SIZE && (
                <li className="text-center mt-2 mb-2">
                    <Button onClick={onLoadMore} color="green">
                        Load More...
                    </Button>
                </li>
            )}
            {isChatEmpty && <li>No Messages Yet....</li>}
            {canShowMessage && renderMessages()}
        </ul>
    )
}

export default Messages
