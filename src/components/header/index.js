import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Dropdown, Avatar, Menu, Space } from 'antd';
import {
  UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined,
} from '@ant-design/icons';

import { appName } from 'config';
import { account, notifications, usersList } from 'routes';

import style from './style.module.scss';

@inject(({ menu, auth }) => ({ menu, auth }))
@observer
class Header extends React.Component {
  onOpenMenu = () => {
    const { menu } = this.props;
    menu.isOpen = true;
  }

  onCloseMenu = () => {
    const { menu } = this.props;
    menu.isOpen = false;
  }

  onLogout = () => {
    const { auth } = this.props;
    auth.logout();
  }

  menu = () => {
    const { auth } = this.props;
    const userAvatar = auth.user.avatarSymbols.length > 0
      ? <Avatar>{ auth.user.avatarSymbols }</Avatar>
      : <Avatar icon={<UserOutlined width={40} />} />;
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
        {
        menu.isOpen
          ? <MenuFoldOutlined className={style.menuButton} onClick={this.onCloseMenu} />
          : <MenuUnfoldOutlined className={style.menuButton} onClick={this.onOpenMenu} />
        }
        <h1><Link to="/">{appName}</Link></h1>
        <Dropdown overlay={this.menu} placement="bottomRight">
          <div className={style.settings}>
            <SettingOutlined className={style.gear} />
            Настройки
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default Header;
