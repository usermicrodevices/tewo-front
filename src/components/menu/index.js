import React from 'react';
import { Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';

import data from './data';
import Item from './item';
import Submenu from './submenu';
import style from './style.module.scss';

const MenuComponent = inject('menu')(observer((props) => {
  const { pathname: currentPathname } = useLocation();
  const findCurrentElement = () => {
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
  const { defaultSelectedKeys, defaultOpenKeys } = findCurrentElement();
  return (
    <Menu
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      mode="inline"
      className={style.menu}
    >
      {
        data.map(({ icon, text, act }) => {
          if (Array.isArray(act)) {
            console.assert(typeof icon !== 'undefined');
            return <Submenu key={text} icon={icon} items={act}>{text}</Submenu>;
          }
          return <Item icon={icon} key={text} act={act}>{text}</Item>;
        })
      }
    </Menu>
  );
}));

export default MenuComponent;
