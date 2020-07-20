import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
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
          <Router>
            <Switch>
              {
                routes.map(({ path, component: Component, exact }) => (
                  <Route path={path} key={path} exact={exact}><Component /></Route>
                ))
              }
              <Route>
                <h1>Not found</h1>
              </Route>
            </Switch>
          </Router>
        </Provider>
      </AuthorizedPage>
    );
  }
}

export default AuthorizedRouter;
