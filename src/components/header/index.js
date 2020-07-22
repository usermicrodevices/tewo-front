import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  Dropdown, Avatar, Menu, Space,
} from 'antd';
import Icon from 'elements/icon';

import { appName } from 'config';
import { account, notifications, usersList } from 'routes';

import style from './style.module.scss';

@inject(({ menu, auth }) => ({ menu, auth }))
@observer
class Header extends React.Component {
  onMenuToggle = () => {
    const { menu } = this.props;
    menu.isOpen = !menu.isOpen;
  }

  onLogout = () => {
    const { auth } = this.props;
    auth.logout();
  }

  menu = () => {
    const { auth } = this.props;
    if (auth.user === null) {
      return null;
    }
    const userAvatar = auth.user.avatarSymbols.length > 0
      ? <Avatar>{ auth.user.avatarSymbols }</Avatar>
      : <Avatar icon={<Icon name="person-outline" size="30px" />} />;
    return (
      <Menu className={style.menu}>
        <Menu.Item>
          <Space>
            { userAvatar }
            { auth.user.name }
          </Space>
        </Menu.Item>
        <Menu.Item><Link to={account.path}>Личный кабинет</Link></Menu.Item>
        <Menu.Item><Link to={notifications.path}>Настройки уведомлений</Link></Menu.Item>
        <Menu.Item><Link to={usersList.path}>Список пользователей</Link></Menu.Item>
        <Menu.Item onClick={this.onLogout}>Выйти</Menu.Item>
      </Menu>
    );
  }

  render() {
    const { menu } = this.props;
    return (
      <div className={style.head}>
        <Icon className={style.menuButton} reflex={!menu.isOpen} name="menu-arrow-outline" color="primary" onClick={this.onMenuToggle} />
        <h1><Link to="/">{appName}</Link></h1>
        <Dropdown overlay={this.menu} placement="bottomRight">
          <div className={style.settings}>
            <Icon className={style.gear} color="text" name="settings-outline" />
            Настройки
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default Header;
