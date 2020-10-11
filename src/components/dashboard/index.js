import React, { useState } from 'react';
import { Provider, inject } from 'mobx-react';
import {
  Button, Dropdown, Menu, Space,
} from 'antd';

import Icon from 'elements/icon';
import DashboardModel from 'models/dashboard';
import { SemanticRanges } from 'utils/date';

import Grid from './grid';
import SettingsEditor from './settingsEditor';

import style from './index.module.scss';

const DateSelector = inject('grid')(({ grid }) => (
  <Menu style={{ width: 300 }}>
    {
      Object.entries(SemanticRanges).map(([range, { title }]) => (
        <Menu.Item style={{ height: 'auto' }} key={range} onClick={() => { grid.setDateRangeGlobal(range); }}>{ title }</Menu.Item>
      ))
    }
  </Menu>
));

const Dashboard = ({ session }) => {
  const [storage] = useState(new DashboardModel('dashboard', session));
  return (
    <Provider grid={storage}>
      <SettingsEditor />
      <div className={style.wrapper}>
        <div className={style.header}>
          <div className={style.title}>Панель управления</div>
          <Space>
            <Dropdown overlay={<DateSelector />} placement="bottomRight">
              <Button icon={<Icon name="calendar-outline" />}>Диапазон дат</Button>
            </Dropdown>
            <Button onClick={() => { storage.editNewSettings(); }}>+ добавить</Button>
          </Space>
        </div>
        <Grid />
      </div>
    </Provider>
  );
};

export default inject('session')(Dashboard);
