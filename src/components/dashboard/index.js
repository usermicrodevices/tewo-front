import React, { useState } from 'react';
import { Provider, inject } from 'mobx-react';
import { Button, Space } from 'antd';

import Icon from 'elements/icon';
import DashboardModel from 'models/dashboard';

import Grid from './grid';

import style from './index.module.scss';

const Dashboard = ({ session }) => {
  const [storage] = useState(new DashboardModel('dashboard', session));
  return (
    <Provider grid={storage}>
      <div className={style.wrapper}>
        <div className={style.header}>
          <div className={style.title}>Панель управления</div>
          <Space>
            <Button icon={<Icon name="calendar-outline" />}>Диапазон дат</Button>
            <Button>+ добавить</Button>
          </Space>
        </div>
        <Grid />
      </div>
    </Provider>
  );
};

export default inject('session')(Dashboard);
