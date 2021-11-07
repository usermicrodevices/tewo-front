import React from 'react';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';

import * as device from 'utils/device';

import getData from './getData';
import Item from './item';
import Submenu from './submenu';
import style from './style.module.scss';

const findCurrentElement = (data, currentPathname) => {
  for (const { act, text } of data) {
    if (Array.isArray(act)) {
      for (const { act: itemAct, text: itemText } of act) {
        if (typeof itemAct === 'object' && itemAct.path === currentPathname) {
          return {
            defaultSelectedKeys: [itemText],
            defaultOpenKeys: [text],
          };
        }
      }
    } else if (typeof act === 'object' && act.path === currentPathname) {
      return {
        defaultSelectedKeys: [text],
        defaultOpenKeys: [],
      };
    }
  }
  return {
    defaultSelectedKeys: [],
    defaultOpenKeys: [],
  };
};

const MenuComponent = inject('menu', 'session')(observer(({ menu, session }) => {
  const data = getData(session);
  const { pathname } = useLocation();
  const { defaultSelectedKeys, defaultOpenKeys } = findCurrentElement(data, pathname);

  function onClickMenu() {
    if (menu.isOpen && device.isMobile()) {
      menu.close();
    }
  }

  return (
    <Menu
      mode="inline"
      onClick={onClickMenu}
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={menu.isOpen ? defaultOpenKeys : []}
      selectedKeys={defaultSelectedKeys}
      className={classnames(style.menu)}
      inlineCollapsed={!menu.isOpen}
    >
      {
        data.map(({ icon, text, act }) => {
          if (Array.isArray(act)) {
            console.assert(typeof icon !== 'undefined');
            return <Submenu key={text} icon={icon} items={act}>{menu.isOpen && text}</Submenu>;
          }
          return <Item icon={icon} key={text} act={act} title={text}>{menu.isOpen && text}</Item>;
        })
      }
    </Menu>
  );
}));

export default MenuComponent;
