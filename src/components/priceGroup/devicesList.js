import React from 'react';

import { Card, Table } from 'antd';

import style from './style.module.scss';

const DevicesList = () => (
  <Card className={style.card}>
    <div className={style.title}>
      Оборудование
      <span className={style.amount}>{}</span>
    </div>
    <Table />
  </Card>
);

export default DevicesList;
