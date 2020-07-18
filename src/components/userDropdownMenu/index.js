import React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Avatar, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import style from './style.module.scss';

const UserDropdownMenu = (() => (
  <Menu className={style.menu}>
    <Menu.Item><Avatar icon={<UserOutlined />} /></Menu.Item>
    <Menu.Item><Link>Личный кабинет</Link></Menu.Item>
    <Menu.Item><Link>Настройки уведомлений</Link></Menu.Item>
    <Menu.Item><Link>Список пользователей</Link></Menu.Item>
    <Menu.Item><Link>Выйти</Link></Menu.Item>
  </Menu>
));

export default UserDropdownMenu;
