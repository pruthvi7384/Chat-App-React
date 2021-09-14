import React from 'react'
import { Alert, Button, Divider, Drawer } from 'rsuite'
import { useProfile } from '../../context/Profile.Context'
import { database } from '../../misc/config';
import { getUserUpDate } from '../../misc/helper';
import AvatarBtnUpload from './AvatarBtnUpload';
import EditableInput from './EditableInput';
import ProviderBlock from './ProviderBlock';

function Dashboard({onsingOut}) {
    const {profile} = useProfile();
    const onSave = async (newInput) => {
      try{
            const updates = await getUserUpDate(profile.uid,'name',newInput,database);
            await database.ref().update(updates);
            Alert.success('Your Nickname has been updated successfully',4000);
      }catch(err){
          Alert.error(err.mesage,4000);
      }
    }
    return (
        <>
            <Drawer.Header>
                <Drawer.Title>
                    Dashboard
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <h3>Hey , {profile.name}</h3>
                <ProviderBlock/>
                <Divider/>
                <EditableInput initialvalue={profile.name} onSave={onSave} label={<h6 className="mb-3">Nickname</h6>}   />
                <AvatarBtnUpload/>
            </Drawer.Body>
            <Drawer.Footer>
                <Button block color="red" onClick={onsingOut}>
                    Sign Out
                </Button>
            </Drawer.Footer>
        </>
    )
}

export default Dashboard
