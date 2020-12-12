import React from 'react';
import { Menu } from 'antd';
import { SemanticRanges } from 'utils/date';

import classnames from './dateSelector.module.scss';

const DateSelector = ({ onClick }) => (
  <Menu className={classnames.menu} onClick={onClick}>
    {
      Object.entries(SemanticRanges).map(([range, { title }]) => (
        <Menu.Item key={range}>{ title }</Menu.Item>
      ))
    }
  </Menu>
);

export default DateSelector;
