import React, { memo } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite'
import { useCurrentRoom } from '../../../context/CurrentRoomContext';
import { database } from '../../../misc/config';
import { useMediaQuery, useModules } from '../../../misc/Custom-Hooks'
import EditableInput from '../../dashboard/EditableInput';

function EditRoomBtn() {
    const isMobile = useMediaQuery('max-width:992px)');
    const {chatid} = useParams();
    const {isOpen, open, close} = useModules();
    const name = useCurrentRoom(v=>v.name);
    const description = useCurrentRoom(v=>v.description);
    const updateData = (key, value) => {
        database.ref(`/rooms/${chatid}`).child(key).set(value).then(()=>{
            Alert.success('Sussesfuly Updated', 4000);
        }).catch(err => {
            Alert.error(err.message,4000);
        })
    }
    const onNameSave = (newName)=>{
        updateData('name', newName);
    }
    const onDescriptionSave = (newDescription)=>{
        updateData('description', newDescription);
    }
    return (
        <div>
            <Button className='br-circle' size="sm" color="red" onClick={open} >
            A
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement="right">
                <Drawer.Header>
                    <Drawer.Title>
                        Edit Room
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <EditableInput 
                    initialvalue={name} 
                    onSave={onNameSave}
                    label={<h6 className="mb-2">Name</h6>} 
                    emptyMessage="name can't be empty" 
                    />
                    <EditableInput
                        componentClass="textarea"
                        rows={5}
                        initialvalue={description}
                        onSave={onDescriptionSave}
                        emptyMessage="description can't be empty"
                        wrapperClassName="mt-3"
                    />

                </Drawer.Body>
                <Drawer.Footer>
                    <Button block onClick={close}>
                        Close
                    </Button>
                </Drawer.Footer>
            </Drawer>
        </div>
    )
}

export default memo(EditRoomBtn)
