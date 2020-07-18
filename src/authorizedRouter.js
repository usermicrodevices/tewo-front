import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'mobx-react';

import Auth from 'models/auth';
import Dashboard from 'pages/dashboard';
import AuthorizedPage from 'components/authorizedPage';

class AuthorizedRouter extends React.Component {
  auth = new Auth();

  render() {
    return (
      <AuthorizedPage>
        <Provider auth={this.auth}>
          <Router>
            <Switch>
              <Route path="/">
                <Dashboard />
              </Route>
              <Route>
                <AuthorizedRouter />
              </Route>
            </Switch>
          </Router>
        </Provider>
      </AuthorizedPage>
    );
  }
}

export default AuthorizedRouter;
