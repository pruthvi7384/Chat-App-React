import React,{useState} from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth }  from '../../misc/config';

function ProviderBlock() {
    const [isConnected,setIsConnected] = useState({
            'google.com': auth.currentUser.providerData.some((data)=>data.providerId === 'google.com'),
            'facebook.com': auth.currentUser.providerData.some((data)=>data.providerId === 'facebook.com'),
        });
    console.log(auth.currentUser);
    const updateIsConnected = (providerId,value) => {
        setIsConnected(p =>{
            return {
                ...p,
                [providerId]:value,
            }
        })
    }
    const unlink = async (providerId) => {
        try{
            if(auth.currentUser.providerData.length === 1){
                throw new Error(`You Can Not Disconnect From ${providerId}`);
            }
           await auth.currentUser.unlink(providerId);
           updateIsConnected(providerId,false);
            Alert.info(`Disconnected ${providerId}`,4000);
        }catch(e){
            Alert.error(e.message,4000);
        }
    }
    const unlinkGoogle = ()=>{
        unlink('google.com');
    }
    const unlinkFacebook = ()=>{
        unlink('facebook.com');
    }
    const link = async (provider) => {
        try{
           await auth.currentUser.linkWithPopup(provider);
           Alert.info(`Linked To ${provider.providerId}`, 4000);
           updateIsConnected(provider.providerId,true);
        }catch(e){
            Alert.error(e.message, 400);
        }
    }
    const linkGoogle = ()=>{
        link(new firebase.auth.GoogleAuthProvider());
    }
    const linkFacebook = ()=>{
        link(new firebase.auth.FacebookAuthProvider());
    }
    return (
        <div>
            {isConnected['google.com'] && (
                <Tag color="green" closable onClose={unlinkGoogle}>
                    <Icon icon="google" /> Connected
                </Tag>
            )}
            {isConnected['facebook.com'] && (
                <Tag color="blue" closable onClose={unlinkFacebook}>
                    <Icon icon="facebook" /> Connected
                </Tag>
            )}
            <div className="mt-2">
                {!isConnected['google.com'] && (
                    <Button block color="green" onClick={linkGoogle}>
                        <Icon icon="google" /> Link To Google
                    </Button>
                )}
                {!isConnected['facebook.com'] && (
                    <Button block color="blue" onClick={linkFacebook}>
                        <Icon icon="facebook" /> Link To Facebook
                    </Button>
                )}
            </div>
        </div>
    )
}

export default ProviderBlock
