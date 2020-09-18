import React from 'react';
import { Card, Table } from 'antd';
import moment from 'moment';
import classnames from 'classnames';

import Icon from 'elements/icon';
import { canceledIcon } from 'elements/beverageIcons';

import style from './index.module.scss';
import genericStyle from '../genericStyle.module.scss';

const COLUMNS = [
  {
    dataIndex: 'deviceDate',
    render: (date) => (
      <>
        <Icon name="clock-outline" />
        { date.format('DD.MM.yy hh:mm') }
      </>
    ),
  },
  {
    dataIndex: 'drinkName',
  },
  {
    dataIndex: 'canceled',
    render: (isCanceled) => isCanceled && canceledIcon,
  },
];

const DATA = new Array(20).fill(null).map(() => ({
  deviceDate: moment(),
  drinkName: 'golovonogies',
  canceled: !!Math.round(Math.random()),
}));

const Beverages = () => (
  <Card className={style.beverages}>
    <div className={classnames(genericStyle.title, style.title)}>
      <Icon size={18} name="droplet-outline" />
      Последние наливы
    </div>
    <div className={style.table}>
      <Table pagination={false} columns={COLUMNS} dataSource={DATA} />
    </div>
  </Card>
);

export default Beverages;
