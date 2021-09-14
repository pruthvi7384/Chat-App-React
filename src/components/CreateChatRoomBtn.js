import React,{ useState, useCallback, useRef } from 'react';
import firebase from 'firebase/app';
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite'
import { useModules } from '../misc/Custom-Hooks';
import { auth, database } from '../misc/config';

const { StringType } = Schema.Types;
const modal = Schema.Model({
    name: StringType().isRequired('Chat Name Is Required'),
    description: StringType().isRequired('Chat Description Is Required'),
})

const INITIAL_FORM_VALUE = {
    name:'',
    description: '',
};

function CreateChatRoomBtn() {
    const { isOpen, open, close} = useModules();
    const [formValue,setFormValue] = useState(INITIAL_FORM_VALUE);
    const [isloading,setIsloading] = useState(false);
    const formRef = useRef();

    const onFormChange = useCallback(
        (value) => {
            setFormValue(value)
        },
        [],
    ) 

    const onSubmit = async ()=>{
        if(!formRef.current.check()){
            return;
        }
        setIsloading(true);
        const newRoomData = {
            ...formValue,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            admins:{
                [auth.currentUser.uid] : true,
            }
        }
        try{
            await database.ref('rooms').push(newRoomData);
            Alert.info(`${formValue.name} has been created`, 4000);
            setIsloading(false);
            setFormValue(INITIAL_FORM_VALUE);
            close();
        }catch(e){
            setIsloading(false);
            Alert.error(e.message, 4000);
        }
    }
    return (
        <div className="mt-1">
            <Button block appearance="primary" color="green" onClick={open}> 
                <Icon icon="creative" /> Create New Chat Room
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        New Chat Room
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} modal={modal} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>  
                                Room Name
                            </ControlLabel>
                            <FormControl name="name" placeholder="Enter Chat Room Name...." />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>  
                                Description
                            </ControlLabel>
                            <FormControl componentClass="textarea" rows={5} name="description" placeholder="Enter Room Description..." />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={isloading} block appearance="primary" onClick={onSubmit}>
                        Create New Chat Room
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateChatRoomBtn
