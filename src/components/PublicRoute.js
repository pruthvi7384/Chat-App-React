import React from 'react'
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/Profile.Context';

function PublicRoute({children,...routePath}) {
    const {profile,isloading} = useProfile();
    if(isloading && !profile) {
        return <Container>
            <Loader center vertical size="md" content="Loading" speed="slow" />
        </Container>
    }
    if(profile && !isloading) {
        return <Redirect to="/" />
    }
    return (
        <Route {...routePath}>
            {children}
        </Route>
    )
}

export default PublicRoute
