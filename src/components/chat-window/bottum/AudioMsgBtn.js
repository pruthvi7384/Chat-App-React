import React,{useState,useCallback} from 'react'
import { Alert, Icon, InputGroup } from 'rsuite'
import { ReactMic } from 'react-mic';
import { storage } from '../../../misc/config';
import { useParams } from 'react-router';

function AudioMsgBtn({afterUpload}) {
    const {chatid} = useParams();
    const [isrecording,setIsloading] = useState(false);
    const [isuploding, setIsUploading] = useState(false);

    const onClick =useCallback(()=>{
        setIsloading(p=>!p);
    },[]);
    const onUpload =useCallback(async (data)=>{
        setIsUploading(true);
        try{
          const snap = await storage
               .ref(`chat/${chatid}`)
               .child(`audio_${Date.now()}.mp3`)
               .put(data.blob,{
                   cacheControl:`public, max-age=${3600 * 24 * 3}`,
                });
                const file = {
                    contentType : snap.metadata.contentType,
                    name : snap.metadata.name,
                    url : await snap.ref.getDownloadURL(),
                }
                setIsUploading(false);
                afterUpload([file]);
        }catch(e){
            setIsUploading(false);
            Alert.error(e.message,4000);
        }
    },[afterUpload,chatid]);
    
    return (
        <>
            <InputGroup.Button  onClick={onClick} disabled={isuploding} className={isrecording ? 'animate-blink' : ''}>
                 <Icon icon="microphone" />
                 <ReactMic
                    record={isrecording}
                    className="d-none"
                    onStop={onUpload}
                    mimeType="audio/mp3"
                />
            </InputGroup.Button>
        </>
    )
}

export default AudioMsgBtn
