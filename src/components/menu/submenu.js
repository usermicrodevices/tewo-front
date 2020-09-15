/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Menu } from 'antd';

import Item from './item';

const { SubMenu } = Menu;

const Submenu = ({
  items,
  children,
  icon,
  ...other
}) => (
  <SubMenu
    key={children}
    title={(
      <span>
        {icon}
        <span>{children}</span>
      </span>
    )}
    {...other}
  >
    {
      items.map(({ act, text }) => (
        <Item key={text} act={act}>{text}</Item>
      ))
    }
  </SubMenu>
);

export default Submenu;
