import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Format from 'elements/format';

import List from './list';

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
  <List
    dataSource={element.prices}
    toDataSource={toDataSource}
    columns={COLUMNS}
    title={`Список напитков (${element.drinksCount})`}
  />
);

export default inject('element')(observer(PriceList));
