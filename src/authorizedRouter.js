import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import Menu from 'components/menu';
import Auth from 'models/auth';
import Dashboard from 'pages/dashboard';

class AuthorizedRouter extends React.Component {
  auth = new Auth();

  render() {
    return (
      <div>
        <Provider auth={this.auth}>
          <Menu />
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
      </div>
    );
  }
}

export default AuthorizedRouter;
