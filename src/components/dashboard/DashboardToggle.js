import React, {useCallback} from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite'
import { auth,database } from '../../misc/config';
import { useModules, useMediaQuery } from '../../misc/Custom-Hooks'
import { isOfflineForDatabase } from '../../context/Profile.Context';
import Dashboard from './index';

function DashboardToggle() {
    const { isOpen, open, close} = useModules();
    const isMobile = useMediaQuery('(max-width:992px)')
    const onsingOut = useCallback(()=>{
     database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
        auth.signOut();
        Alert.info('Sign out',4000);
        close();
     }).catch(err => {
         Alert.error(err.message,4000);
     });
    },[close])
    return (
        <>
            <Button block color="blue" onClick={open}>
                <Icon icon="dashboard"/> Dashboard
            </Button>   
            <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
                <Dashboard onsingOut={onsingOut}/>
            </Drawer>
        </>
    )
}

export default DashboardToggle
