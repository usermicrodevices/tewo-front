import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';

import Icon from 'elements/icon';
import Format from 'elements/format';

import List from './list';
import priceCell from './priceCell';

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
    render: priceCell,
  },
  {
    title: '',
    dataIndex: 'rm',
    render: (rm) => <Button disabled icon={<Icon size={20} name="trash-2-outline" />} type="text" onClick={rm} />,
  },
];

const toDataSource = (price) => ({
  plu: price.plu,
  key: price.id,
  name: price.name,
  value: price.value,
  rm: () => {},
  sendValue: () => new Promise((_, reject) => { setTimeout(reject, 1000); }),
});

const PriceList = ({ element }) => (
  <List
    dataSource={element.prices}
    toDataSource={toDataSource}
    columns={COLUMNS}
    title={`Список напитков (${element.drinksCount})`}
  />
);

export default inject('element')(observer(PriceList));
