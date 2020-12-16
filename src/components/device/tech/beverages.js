import React from 'react';
import { Card, Table } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import Format from 'elements/format';
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
    render: (drink) => <Format>{ drink }</Format>,
  },
  {
    dataIndex: 'canceled',
    render: (isCanceled) => isCanceled && canceledIcon,
  },
];

const Beverages = ({ element: { details: { lastBeverages, serviceEvents } } }) => {
  const ds = lastBeverages?.map(({
    deviceDate, drinkName, canceled, id,
  }) => ({
    deviceDate, drinkName, canceled, key: id,
  }));
  return (
    <Card className={classnames(style.beverages, { [style.onlybeverages]: !Array.isArray(serviceEvents) || serviceEvents.length === 0 })}>
      <div className={classnames(genericStyle.title, style.title)}>
        <CoffeeOutlined />
        Последние наливы
      </div>
      <div className={style.table}>
        <Table
          pagination={false}
          columns={COLUMNS}
          dataSource={ds}
        />
      </div>
    </Card>
  );
};

export default inject('element')(observer(Beverages));
