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
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: 'Валюта',
    dataIndex: 'isCynchronized',
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: 'Цена',
    dataIndex: 'value',
    render: priceCell,
  },
  {
    title: '',
    dataIndex: 'rm',
    render: (rm) => <Button icon={<Icon size={20} name="trash-2-outline" />} type="text" onClick={rm} />,
  },
];

const PriceList = ({ element, onAdd, isLoading }) => {
  const toDataSource = (price) => ({
    plu: price.plu,
    key: price.id,
    name: price.name,
    value: price.value,
    isCynchronized: null,
    syncDate: null,
    rm: () => element.removePrice(price.id),
    sendValue: (value) => price.setValue(value),
  });

  return (
    <List
      isLoading={isLoading}
      dataSource={element.prices}
      toDataSource={toDataSource}
      columns={COLUMNS}
      onAdd={onAdd}
      title={`Список напитков (${element.drinksCount})`}
    />
  );
};

export default inject('element')(observer(PriceList));
