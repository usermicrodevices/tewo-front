import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import UnauthorizedPage from 'elements/unauthorizedPage';
import Loader from 'elements/loader';

import AuthorizedRouter from './authorizedRouter';
import { defaultAuthorizedRout, defaultUnauthorizedRout, unauthorizedRoutes as routes } from './routes';

const RootRouter = inject('auth')(observer(({ auth }) => {
  if (auth.isAuthChecked === false) {
    return <Loader fullscreen />;
  }
  const authorizedRedirect = auth.isAuthorized && <Redirect to={defaultAuthorizedRout.path} />;
  const unauthorizedRedirect = !auth.isAuthorized && <Redirect to={defaultUnauthorizedRout.path} />;
  return (
    <Router>
      <Switch>
        {
          routes.map(({ path, component: Component, exact }) => (
            <Route key={path} path={path} exact={exact}>
              { authorizedRedirect }
              { !auth.isAuthorized && (
                <UnauthorizedPage>
                  <Component />
                </UnauthorizedPage>
              )}
            </Route>
          ))
        }
        <Route>
          { unauthorizedRedirect }
          { auth.isAuthorized && <AuthorizedRouter /> }
        </Route>
      </Switch>
    </Router>
  );
}));

export default RootRouter;
