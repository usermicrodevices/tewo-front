import React from 'react';
import { Menu } from 'antd';
import { SemanticRanges } from 'utils/date';

const DateSelector = ({ onClick }) => (
  <Menu style={{ width: 300 }} onClick={onClick}>
    {
      Object.entries(SemanticRanges).map(([range, { title }]) => (
        <Menu.Item key={range}>{ title }</Menu.Item>
      ))
    }
  </Menu>
);

export default DateSelector;
