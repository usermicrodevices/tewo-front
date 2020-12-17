import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Popconfirm } from 'antd';

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
    sorter: (a, b) => {
      if (typeof a.name === 'string' && typeof b.name === 'string') {
        return a.name.localeCompare(b.name) || a.key - b.key;
      }
      return a.key - b.key;
    },
    defaultSortOrder: 'ascend',
  },
  {
    title: 'НДС',
    dataIndex: 'nds',
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: 'Цена',
    dataIndex: 'value',
    render: priceCell,
    sorter: (a, b) => b.value - a.value || a.key - b.key,
  },
  {
    title: '',
    dataIndex: 'rm',
    render: (rm) => (
      <Popconfirm
        placement="left"
        title="Отмена операции невозможна. Продолжить удаление?"
        onConfirm={rm}
        okText="Да"
        cancelText="Нет"
      >
        <Button icon={<Icon size={20} name="trash-2-outline" />} type="text" />
      </Popconfirm>
    ),
  },
];

const PriceList = ({ element, onAdd, isLoading }) => {
  const { conceptionExtPLU } = element;
  const toDataSource = (price) => ({
    plu: `${price.plu} (${(conceptionExtPLU && conceptionExtPLU[price.drinkId]) || '—'})`,
    key: price.id,
    name: price.name,
    value: price.value,
    nds: price.nds,
    currency: price.currency,
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
