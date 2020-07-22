import React from 'react';
import { observe } from 'mobx';
import { Provider } from 'mobx-react';
import classNames from 'classnames';

import Menu from 'components/menu';
import Header from 'components/header';

import MenuModel from 'models/menu';

import style from './style.module.scss';

class AuthorizedPage extends React.Component {
  menuModel = new MenuModel();

  componentDidMount() {
    observe(this.menuModel, 'isOpen', () => {
      this.forceUpdate();
    });
  }

  render() {
    const { children } = this.props;
    return (
      <div className={classNames(style.main, { [style.smallMenu]: !this.menuModel.isOpen })}>
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
