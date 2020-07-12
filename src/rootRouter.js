import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Login from 'pages/login';
import { isAuthorized } from 'models/auth';

import AuthorizedRouter from './authorizedRouter';

const RootRouter = () => (
  <Router>
    { isAuthorized() === false && <Redirect to="/signin" /> }
    <Switch>
      <Route path="/signin">
        <Login />
      </Route>
      <Route>
        <AuthorizedRouter />
      </Route>
    </Switch>
  </Router>
);

export default RootRouter;
