/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Item = ({
  act,
  children,
  icon,
  ...other
}) => {
  if (typeof act === 'object') {
    return <Menu.Item icon={icon} {...other}><Link to={act.path}>{children}</Link></Menu.Item>;
  }
  return <Menu.Item icon={icon} disabled {...other}>{children}</Menu.Item>;
};

export default Item;
