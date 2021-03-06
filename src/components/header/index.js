import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  Dropdown, Avatar, Menu, Space,
} from 'antd';
import Icon from 'elements/icon';

import {
  profile,
  notifications,
  mailings,
  usersList,
  defaultAuthorizedRout,
} from 'routes';

import style from './style.module.scss';

const ProfileAvatar = observer(({ user }) => {
  const symbolAvatar = user.avatarSymbols.length > 0
    ? <Avatar>{ user.avatarSymbols }</Avatar>
    : <Avatar icon={<Icon name="person-outline" size="30px" />} />;

  return user.avatar ? <Avatar src={user.avatar} /> : symbolAvatar;
});

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

    return (
      <Menu className={style.menu}>
        <Menu.Item>
          <Space>
            <ProfileAvatar user={auth.user} />
            { auth.user.name }
          </Space>
        </Menu.Item>
        <Menu.Item><Link to={profile.path}>Личный кабинет</Link></Menu.Item>
        <Menu.Item><Link to={notifications.path}>Настройка уведомлений</Link></Menu.Item>
        <Menu.Item><Link to={usersList.path}>Список пользователей</Link></Menu.Item>
        <Menu.Item><Link to={mailings.path}>Email рассылки</Link></Menu.Item>
        <Menu.Item onClick={this.onLogout}>Выйти</Menu.Item>
      </Menu>
    );
  }

  render() {
    const { menu } = this.props;
    return (
      <div className={style.head}>
        <Icon className={style.menuButton} reflex={!menu.isOpen} name="menu-arrow-outline" color="primary" onClick={this.onMenuToggle} />
        <Link className={style.title} to={defaultAuthorizedRout.path} />
        <Dropdown overlay={this.menu} placement="bottomRight">
          <div className={style.settings}>
            <Icon className={style.gear} color="text" name="settings-outline" />
            <span className={style.label}>Настройки</span>
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default Header;
