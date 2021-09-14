import React,{ useState, useRef } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModules } from '../../misc/Custom-Hooks';
import { database, storage } from '../../misc/config';
import { useProfile } from '../../context/Profile.Context';
import ProfilrAvator from '../ProfilrAvator';
import { getUserUpDate } from '../../misc/helper';

const fileInputType = '.png,.jpeg..jpg';
const acceptebaleFileType = ['image/png','image/jpeg','image/pjpeg'];
const isValidFileType = (file)=> acceptebaleFileType.includes(file.type);

const getBlob = (canvas)=>{
    return new Promise((resolve, reject)=>{
        canvas.toBlob( (blob)=>{
            if(blob){
                resolve(blob);
            }else{
                reject(new Error('File Process Error'));
            }
        } )
    })
}

function AvatarBtnUpload() {
    const {isOpen, open, close} = useModules();
    const [img,setImg] = useState(null);
    const [isloading, setIsloading] = useState(false);
    const avatorEditorRef = useRef();
    const {profile} = useProfile();
    const onFileInputChange = (ev)=>{
        const currentFile = ev.target.files;
        if(currentFile.length === 1){
            const file = currentFile[0];
            if(isValidFileType(file)){
                setImg(file);
                open();
            }else{
                Alert.warning(`Wrong File Type ${file.type}`,4000);
            }

        }
    };
    const onUploadAvator = async ()=>{
        const canvas = avatorEditorRef.current.getImageScaledToCanvas();
        setIsloading(true);
        try{
            const blob = await getBlob(canvas);
            const avatorFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');
            const uploadAvatorResult = await avatorFileRef.put( blob , {
                cacheControl : `public, max-age=${3600 * 24 * 3}`
            });
            const downloadurl = await uploadAvatorResult.ref.getDownloadURL();

            const updates = await getUserUpDate(profile.uid,'avatar',downloadurl,database);
            await database.ref().update(updates);
            setIsloading(false);
            Alert.success('user Avator has been successfully uploaded', 4000);
        }catch(e){
            setIsloading(false);
            Alert.error(e.message,4000);
        }
    }
    return (
        <div className="mt-3 text-center">
            <ProfilrAvator src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge" />
            <div>
                <label htmlFor="newAvatar" className="d-block cursor-pointer padded">
                    Select new avatar
                    <input id="newAvatar" type="file" className="d-none" accept={fileInputType} onChange={onFileInputChange}/>
                </label>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>
                            Adjust and upload new avatar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-center align-items-center h-100">
                            {img && (
                                <AvatarEditor
                                ref={avatorEditorRef}
                                image={img}
                                width={200}
                                height={200}
                                border={10}
                                borderRadius={100}
                                rotate={0}
                            />
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={isloading} block appearance="ghost" onClick={onUploadAvator}>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarBtnUpload
