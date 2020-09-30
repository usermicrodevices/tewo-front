import React from 'react';

import { Card, Table } from 'antd';

import style from './style.module.scss';

const PriceList = () => (
  <Card className={style.card}>
    <div className={style.title}>
      Оборудование
      <span className={style.amount}>{0}</span>
    </div>
    <Table />
  </Card>
);

export default PriceList;
