import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router';
import { Col, Grid, Row } from 'rsuite'
import Sidebar from '../../components/Sidebar';
import { RoomProvider } from '../../context/RoomContext';
import { useMediaQuery } from '../../misc/Custom-Hooks';
import Chat from './Chat';

function Home() {
    const isDesktop = useMediaQuery('(min-width: 992px)');
    const {isExact} = useRouteMatch();

    const canRenderSidebar = isDesktop || isExact;

    return (
        <RoomProvider>
            <Grid fluid className="h-100">
                <Row className="h-100">
                    {canRenderSidebar && (
                        <Col xs={24} md={8} className="h-100">
                            <Sidebar/>
                        </Col>
                    )}
                    <Switch>
                        <Route exact path="/chat/:chatid">
                            <Col xs={24} md={16} className="h-100">
                                <Chat/>
                            </Col>
                        </Route>
                        <Route>
                            {isDesktop && (
                                <Col xs={24} md={16} className="h-100">
                                    <h6 className="text-center mt-page">Please Select Chat...</h6>
                                </Col>
                            )}
                        </Route>
                    </Switch>
                </Row>
            </Grid>
        </RoomProvider>
    )
}

export default Home
