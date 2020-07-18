import React from 'react';
import { Provider } from 'mobx-react';

import Menu from 'components/menu';
import Header from 'components/header';

import MenuModel from 'models/menu';

import style from './style.module.scss';

class AuthorizedPage extends React.Component {
  menuModel = new MenuModel();

  render() {
    const { children } = this.props;
    return (
      <div className={style.main}>
        <Provider menu={this.menuModel}>
          <div className={style.header}>
            <Header />
          </div>
          <Menu />
          <content>
            {children}
          </content>
        </Provider>
      </div>
    );
  }
}

export default AuthorizedPage;
