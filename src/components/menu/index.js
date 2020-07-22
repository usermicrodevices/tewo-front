import React from 'react';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import data from './data';
import Item from './item';
import Submenu from './submenu';
import style from './style.module.scss';

const findCurrentElement = (currentPathname) => {
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

const MenuComponent = inject('menu')(observer(({ menu }) => {
  const { pathname } = useLocation();
  const { defaultSelectedKeys, defaultOpenKeys } = findCurrentElement(pathname);
  return (
    <Menu
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      mode={menu.mode}
      className={style.menu}
    >
      {
        data.map(({ icon, text, act }) => {
          if (Array.isArray(act)) {
            console.assert(typeof icon !== 'undefined');
            return <Submenu key={text} icon={icon} items={act}>{menu.isOpen && text}</Submenu>;
          }
          return <Item icon={icon} key={text} act={act}>{menu.isOpen && text}</Item>;
        })
      }
    </Menu>
  );
}));

export default MenuComponent;
