import React from 'react';
import { Card, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import Format from 'elements/format';
import Icon from 'elements/icon';
import { canceledIcon } from 'elements/beverageIcons';

import style from './index.module.scss';
import genericStyle from '../genericStyle.module.scss';

const COLUMNS = [
  {
    dataIndex: 'deviceDate',
    render: (date) => <Format>{ date }</Format>,
  },
  {
    dataIndex: 'drinkName',
  },
  {
    dataIndex: 'canceled',
    render: (isCanceled) => isCanceled && canceledIcon,
  },
];

const Beverages = ({ element: { details: { lastBeverages } } }) => (
  <Card className={style.beverages}>
    <div className={classnames(genericStyle.title, style.title)}>
      <Icon size={18} name="droplet-outline" />
      Последние наливы
    </div>
    <div className={style.table}>
      <Table pagination={false} columns={COLUMNS} dataSource={lastBeverages} />
    </div>
  </Card>
);

export default inject('element')(observer(Beverages));
