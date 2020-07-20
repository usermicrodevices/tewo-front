import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Login from 'pages/login';
import Signup from 'pages/signup';

import UnauthorizedPage from 'elements/unauthorizedPage';
import Loader from 'elements/loader';

import AuthorizedRouter from './authorizedRouter';

const RootRouter = inject('auth')(observer(({ auth }) => {
  if (auth.isAuthChecked === false) {
    return <Loader fullscreen />;
  }
  const authorizedRedirect = auth.isAuthorized && <Redirect to="/" />;
  return (
    <Router>
      <Switch>
        <Route path="/signin">
          { authorizedRedirect }
          <UnauthorizedPage>
            <Login />
          </UnauthorizedPage>
        </Route>
        <Route path="/signup">
          { authorizedRedirect }
          <UnauthorizedPage>
            <Signup />
          </UnauthorizedPage>
        </Route>
        <Route>
          { !auth.isAuthorized && <Redirect to="/signin" /> }
          <AuthorizedRouter />
        </Route>
      </Switch>
    </Router>
  );
}));

export default RootRouter;
