import React from 'react'
import { Button, Modal } from 'rsuite';
import { useModules } from '../../../misc/Custom-Hooks';
import ProfilrAvator from '../../ProfilrAvator';

function ProfileModalBtn({profile,children, ...btnProps}) {
    const shortName = profile.name.split(' ')[0];
    const {isOpen,open,close} = useModules();
    const {name,createdAt,avatar} = profile;
    const memberSince = new Date(createdAt).toLocaleDateString();
    return (
        <>
            <Button {...btnProps} onClick={open}>
                {shortName}
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        {shortName} Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <ProfilrAvator src={avatar} name={name} className="width-200 height-200 img-fullsize font-huge" />
                    <h4 className="mt-2">{name}</h4>
                    <p>Member Since {memberSince}</p>
                </Modal.Body>
                <Modal.Footer>
                    {children}
                    <Button block onClick={close}>
                        Close 
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProfileModalBtn
