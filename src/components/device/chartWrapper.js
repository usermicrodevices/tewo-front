/* eslint no-param-reassign: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Card, Dropdown, Menu, Space,
} from 'antd';

import Icon from 'elements/icon';
import DatergangePicker from 'elements/filters/daterangepicker';

import style from './chartWrapper.module.scss';

const Clearance = ({ element: { details }, children }) => (
  <Card className={style.root}>
    <div className={style.selectors}>
      <DatergangePicker title="Период" value={details.dateRange} onChange={(v) => { details.dateRange = v; }} />
      <Dropdown overlay={<Menu />} placement="bottomRight">
        <Space>
          <span>Настройка источников</span>
          <Icon name="arrow-ios-downward-outline" />
        </Space>
      </Dropdown>
    </div>
    <div className={style.chart}>
      { children }
    </div>
  </Card>
);

export default inject('element')(observer(Clearance));
