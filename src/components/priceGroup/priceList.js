import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button } from 'antd';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Format from 'elements/format';
import Typography from 'elements/typography';

import style from './style.module.scss';

const COLUMNS = [
  {
    title: 'PLU (доп PLU)',
    dataIndex: 'plu',
  },
  {
    title: 'Название',
    dataIndex: 'name',
    render: (name) => <Format>{name}</Format>,
  },
  {
    title: 'НДС',
    dataIndex: 'syncDate',
    render: () => <Format>{null}</Format>,
  },
  {
    title: 'Валюта',
    dataIndex: 'isCynchronized',
    render: () => <Format>{null}</Format>,
  },
  {
    title: 'Цена',
    dataIndex: 'value',
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: '',
    dataIndex: 'rm',
    render: (rm) => <Button className={classNames(style.rm)} icon={<Icon size={20} name="trash-2-outline" />} type="text" onClick={rm} />,
  },
];

const toDataSource = (price) => ({
  plu: price.plu,
  key: price.id,
  name: price.name,
  value: price.value,
  rm: () => {},
});

const PriceList = ({ element }) => (
  <Card className={style.card}>
    <div className={style.title}>
      <Typography.Title level={3} className={style.titletext}>
        Список напитков
        <span>{` (${element.drinksCount})`}</span>
      </Typography.Title>
      <Button type="text" disabled icon={<Icon size={22} name="plus-circle-outline" />} />
    </div>
    { element.prices
      ? <Table pagination={false} columns={COLUMNS} dataSource={element.prices.map(toDataSource)} />
      : <Loader size="large" /> }
  </Card>
);

export default inject('element')(observer(PriceList));
