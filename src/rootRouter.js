import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Login from 'pages/login';
import Signup from 'pages/signup'
import UnauthorizedPage from 'elements/unauthorizedPage';
import { isAuthorized } from 'models/auth';

import AuthorizedRouter from './authorizedRouter';

const RootRouter = () => (
  <Router>
    { isAuthorized() === false && <Redirect to="/signin" /> }
    <Switch>
      <Route path="/signin">
        <UnauthorizedPage>
          <Login />
        </UnauthorizedPage>
      </Route>
      <Route path="/signup">
        <UnauthorizedPage>
          <Signup />
        </UnauthorizedPage>
      </Route>
      <Route>
        <AuthorizedRouter />
      </Route>
    </Switch>
  </Router>
);

export default RootRouter;
