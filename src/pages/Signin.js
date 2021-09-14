import React from 'react'
import firebase from 'firebase/app';
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from 'rsuite'
import { auth, database } from '../misc/config'

function Signin() {
    const singinProvider = async (provider) => {
        try{
            const {additionalUserInfo, user} = await auth.signInWithPopup(provider);
            if(additionalUserInfo.isNewUser){
               await database.ref(`/profiles/${user.uid}`).set({
                    name: user.displayName,
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                })
            }
            Alert.success('Singed In',4000);
        }catch(e){
            Alert.error(e.message,4000);
        }
    }
    const singinWithFacebook = ()=>{
        singinProvider(new firebase.auth.FacebookAuthProvider());
    }
    const singinWithGoogle = ()=>{
        singinProvider(new firebase.auth.GoogleAuthProvider());
    }
    return (
        <Container>
            <Grid className="mt-page">
                <Row>
                    <Col xs={24} md={12} mdOffset={6}>
                        <Panel>
                            <div className="text-center">
                                <h2>Welcome To Chat App</h2>
                                <p>Singin With Any Method and Start Chating</p>
                            </div>
                            <div className="mt-3">
                                <Button block color="blue" onClick={singinWithFacebook}>
                                    <Icon icon="facebook" /> Continue With Facebook Login
                                </Button>
                                <Button block color="green" onClick={singinWithGoogle}>
                                    <Icon icon="google" /> Continue With Google Login
                                </Button>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        </Container>
    )
}

export default Signin
