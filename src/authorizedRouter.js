import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { inject, Provider, observer } from 'mobx-react';

import Session from 'models/session';
import AuthorizedPage from 'components/authorizedPage';
import EroorPage from 'pages/eroor';

import { authorizedRoutes as routes } from './routes';

@inject('auth')
@observer
class AuthorizedRouter extends React.Component {
  session = new Session();

  state = { error: null };

  constructor(props) {
    super(props);
    const { user } = props.auth;

    user.session = this.session;
    this.session.user = user;
  }

  static getDerivedStateFromError(error) {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return { error };
  }

  render() {
    const { error } = this.state;
    return (
      <AuthorizedPage>
        <Provider session={this.session}>
          { error
            ? <EroorPage error={error} />
            : (
              <Switch>
                {
                  routes.map(({ path, component: Component, exact }) => (
                    <Route key={path} path={path} exact={exact}><Component /></Route>
                  ))
                }
                <Route>
                  <h1>Not found</h1>
                </Route>
              </Switch>
            )}
        </Provider>
      </AuthorizedPage>
    );
  }
}

export default AuthorizedRouter;
