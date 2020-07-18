import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Login from 'pages/login';
import Signup from 'pages/signup';

import UnauthorizedPage from 'elements/unauthorizedPage';
import { checkAuthorisation } from 'models/auth';
import Loader from 'elements/loader';

import AuthorizedRouter from './authorizedRouter';

class RootRouter extends React.Component {
  state = {
    isAuthChecked: false,
    isAuthorized: false,
  };

  componentDidMount() {
    checkAuthorisation().then((isAuthorized) => {
      this.setState({
        isAuthChecked: true,
        isAuthorized,
      });
    });
  }

  render() {
    const { isAuthChecked } = this.state;
    if (isAuthChecked === false) {
      return <Loader fullscreen />;
    }
    const { isAuthorized } = this.state;
    return (
      <Router>
        <Switch>
          <Route path="/signin">
            { isAuthorized && <Redirect to="/" /> }
            <UnauthorizedPage>
              <Login />
            </UnauthorizedPage>
          </Route>
          <Route path="/signup">
            { isAuthorized && <Redirect to="/" /> }
            <UnauthorizedPage>
              <Signup />
            </UnauthorizedPage>
          </Route>
          <Route>
            { !isAuthorized && <Redirect to="/signin" /> }
            <AuthorizedRouter />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default RootRouter;
