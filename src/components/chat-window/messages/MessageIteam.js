import React,{memo} from 'react'
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/CurrentRoomContext';
import { auth } from '../../../misc/config';
import { useHover, useMediaQuery } from '../../../misc/Custom-Hooks';
import PresenceDot from '../../PresenceDot';
import ProfilrAvator from '../../ProfilrAvator'
import IconBtnControal from './IconBtnControal';
import ImgBtnModal from './ImgBtnModal';
import ProfileModalBtn from './ProfileModalBtn';

const renderFileMsg = (file) =>{
    if(file.contentType.includes('image')){
        return <div className="height-220">
            <ImgBtnModal src={file.url} fileName={file.name} />
        </div>
    }
    if(file.contentType.includes('audio')){
        return <audio controls> 
            <source src={file.url} type="audio/mp3"/> 
            Your Browser Does Not support audio element
        </audio>
    }
    return <a href={file.url}> Dounload File {file.name}</a>
}

function MessageIteam({ message,handleAdminGrant,handleLike,handaleDelete }) {
    const { author,createdAt,text,file,likes,likeCount } = message;
    const [selRef, isHover] = useHover();
    const isAdmin = useCurrentRoom(v=>v.isAdmin);
    const admins = useCurrentRoom(v=>v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const adminGrant = isAdmin && !isAuthor;
    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
    const isMobile = useMediaQuery(('(max-width:992px)'));
    const canShowIcon = isMobile || isHover;
    return (
       <li className={`padded mb-1 cursor-pointer ${isHover ? 'bg-black-02' : ''}`} ref={selRef}>
            <div className="d-flex align-items-center font-bolder mb-1">
            <PresenceDot uid={author.uid} />
                <ProfilrAvator src={author.avatar} name={author.name} className="ml-1" size="xs" />
                <ProfileModalBtn profile={author} appearance="link" className="p-0 ml-1 text-black">
                    {adminGrant && (
                        <Button block onClick={()=>handleAdminGrant(author.uid)} color="blue">
                            {isMsgAuthorAdmin ? 'Remove Admin Permission' : 'Give Admin In This Group'}
                        </Button>
                    )}
                </ProfileModalBtn>
                <TimeAgo
                    className="font-normal text-black-45 ml-2"
                    datetime={createdAt}
                />
                <IconBtnControal
                    {...(isLiked ? {color: 'red'} : {})}
                    isVisible={canShowIcon}
                    iconName="heart"
                    tooltip="Like This Message"
                    onClick={()=>handleLike(message.id)}
                    badgeContent = {likeCount}
                />
                {isAuthor && (
                    <IconBtnControal
                    isVisible={canShowIcon}
                    iconName="close"
                    tooltip="Delete This Message"
                    onClick={()=>handaleDelete(message.id,file)}
                />
                )}
            </div>
            <div>
                {text && <span className="word-breal-all">{text}</span>}
                {file && renderFileMsg(file)}
            </div>
       </li>
    )
}

export default memo(MessageIteam)
