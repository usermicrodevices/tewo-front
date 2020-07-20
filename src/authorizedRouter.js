import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'mobx-react';

import Session from 'models/session';
import Dashboard from 'pages/dashboard';
import AuthorizedPage from 'components/authorizedPage';

class AuthorizedRouter extends React.Component {
  session = new Session();

  render() {
    return (
      <AuthorizedPage>
        <Provider session={this.session}>
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
