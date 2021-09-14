import React from 'react';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/Profile.Context';
import Home from './pages/Home';
import Signin from './pages/Signin';
import './styles/main.scss';
import './styles/utility.scss';

function App() {
  return (
    <ProfileProvider>
      <Switch>
          <PublicRoute path="/singin">
              <Signin/>
          </PublicRoute>
          <PrivateRoute path="/">
              <Home/>
          </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
