import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Session from 'models/session';
import AuthorizedPage from 'components/authorizedPage';

import { authorizedRoutes as routes } from './routes';

class AuthorizedRouter extends React.Component {
  session = new Session();

  render() {
    return (
      <AuthorizedPage>
        <Provider session={this.session}>
          <Switch>
            {
              routes.filter(({ isWithId }) => isWithId).map(({ path, component: Component }) => (
                <Route path={`${path}/:id`} key={`${path}_id`}><Component /></Route>
              ))
            }
            {
              routes.map(({ path, component: Component, exact }) => (
                <Route key={path} path={path} exact={exact}><Component /></Route>
              ))
            }
            <Route>
              <h1>Not found</h1>
            </Route>
          </Switch>
        </Provider>
      </AuthorizedPage>
    );
  }
}

export default AuthorizedRouter;
