import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';

import { appName } from 'config';
import userMenu from 'components/userDropdownMenu';

import style from './style.module.scss';

@inject('menu')
@observer
class Header extends React.Component {
  onOpenMenu = () => {
    const { menu } = this.props;
    menu.isOpen = true;
    console.log(menu.isOpen);
  }

  onCloseMenu = () => {
    const { menu } = this.props;
    menu.isOpen = false;
    console.log(menu.isOpen);
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
        <Dropdown overlay={userMenu} placement="bottomRight">
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
