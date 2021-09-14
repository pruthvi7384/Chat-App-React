import React,{ useState,useCallback } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useProfile } from '../../../context/Profile.Context';
import { useParams } from 'react-router';
import { database } from '../../../misc/config';
import AttachmentBtn from './AttachmentBtn';
import AudioMsgBtn from './AudioMsgBtn';

function assemblemessage(profile,chatid) {
    return {
        roomId : chatid,
        author : {
            name:profile.name,
            uid:profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? {avatar:profile.avatar} : {} )
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        likeCount:0,
    }
}

function Bottom() {
    const [input, setInput] = useState('');
    const { chatid } = useParams();
    const {profile} = useProfile();
    const [isloading,setIsloading] = useState(false);
    const onChangeInput = (value)=>{
        setInput(value);
    }
    const onSendClick = async ()=>{
        if(input.trim() === ''){
            return;
        }
        const magData = assemblemessage(profile,chatid);
        magData.text = input;
        const updates = {};
        const messageId = database.ref('messages').push().key;
        updates[`/messages/${messageId}`] = magData;
        updates[`/rooms/${chatid}/lastMessage`] ={
            ...magData,
            msgId: messageId,
        };
        setIsloading(true);
        try{
            await database.ref().update(updates);
            setInput('');
            setIsloading(false);
        }catch(e){
            setIsloading(false);
            Alert.error(e.message, 4000);
        }
    }
    const onKeyDown = (ev)=>{
        if(ev.keyCode === 13){
            ev.preventDefault();
            onSendClick();
        }
    }
    const afterUpload = useCallback(async (files)=>{
        setIsloading(true);
        const updates = {};
        files.forEach(file =>{
            const magData = assemblemessage(profile,chatid);
            magData.file = file;
            const messageId = database.ref('messages').push().key;
            updates[`/messages/${messageId}`] = magData;
        });
        const lastMessageId = Object.keys(updates).pop();
        updates[`/rooms/${chatid}/lastMessage`] ={
            ...updates[lastMessageId],
            msgId: lastMessageId,
        };

        try{
            await database.ref().update(updates);
            setIsloading(false);
        }catch(e){
            setIsloading(false);
            Alert.error(e.message, 4000);
        }

    },[chatid,profile]);
    return (
        <div>
            <InputGroup>
                <AttachmentBtn afterUpload={afterUpload}/>
                <AudioMsgBtn afterUpload={afterUpload} />
                <Input value={input} placeholder="write a new message here..." onChange={onChangeInput} onKeyDown={onKeyDown} />
                <InputGroup.Button disabled={isloading} color="blue" appearance="primary" onClick={onSendClick}>
                    <Icon icon="send" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default Bottom
