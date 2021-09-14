import React,{useState} from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite'
import { storage } from '../../../misc/config';
import { useModules } from '../../../misc/Custom-Hooks';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

function AttachmentBtn({afterUpload}) {
    const {chatid} = useParams();
    const {isOpen, open, close} = useModules();
    const [fileList,setFileList] = useState([]);
    const [isloading,setIsloading] = useState(false);
    const onChange = (fileArr)=>{
        const filetred = fileArr.filter(el=>el.blobFile.size <= MAX_FILE_SIZE).slice(0,5);
        setFileList(filetred);
    }
    const onUpload = async ()=>{
        try{
            setIsloading(true);
            const uploadPromiss = fileList.map(f=>{
               return storage
               .ref(`chat/${chatid}`)
               .child(Date.now() + f.name)
               .put(f.blobFile,{
                   cacheControl:`public, max-age=${3600 * 24 * 3}`,
                });
            });
            const uploadSnapshorts = await Promise.all(uploadPromiss);
            const snapPromisses = uploadSnapshorts.map(async snap =>{
                return {
                    contentType : snap.metadata.contentType,
                    name : snap.metadata.name,
                    url : await snap.ref.getDownloadURL(),
                }
            });
            const files = await Promise.all(snapPromisses);
            await afterUpload(files);
            setIsloading(false);
            close();
        }catch(e){
            setIsloading(false);
            Alert.error(e.message,4000);
        }
    }
    return (
        <>
            <InputGroup.Button onClick={open}>
                <Icon icon="attachment" />
            </InputGroup.Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        Upload Files
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Uploader
                        autoUpload={false}
                        fileList={fileList}
                        action=""
                        onChange={onChange}
                        multiple
                        listType="picture-text"
                        className="w-100"
                        disabled={isloading}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={isloading} block onClick={onUpload}>
                        Send To Chat
                    </Button>
                    <div className="text-right mt-2">
                        <small>*only files less than 5 mb are allowed!</small>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AttachmentBtn
