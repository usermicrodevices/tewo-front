import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';

import Format from 'elements/format';

import classes from './primecost/index.module.scss';

const columns = (width) => [
  {
    title: 'Напиток',
    dataIndex: 'name',
    render: (name) => <Format width={width[0]}>{name}</Format>,
    width: width[0],
  },
  {
    title: 'Кол-во напитков',
    dataIndex: 'drinksCount',
    render: (drinksCount) => <Format>{drinksCount}</Format>,
    width: width[1],
    sorter: (a, b) => a.drinksCount - b.drinksCount,
  },
  {
    title: 'Кол-во ингредиентов',
    dataIndex: 'ingredientsCount',
    render: (ingredientsCount) => <Format>{ingredientsCount}</Format>,
    width: width[2] + width[3],
    sorter: (a, b) => a.ingredientsCount - b.ingredientsCount,
  },
  {
    title: 'Сумма',
    dataIndex: 'earn',
    render: (earn) => <Format>{earn}</Format>,
    width: width[4],
    sorter: (a, b) => a.earn - b.earn,
  },
];

const Details = ({ columnWidth, _, item }) => {
  const { detailsRows } = item;
  return (
    <Table
      className={classes.details}
      columns={columns(columnWidth)}
      dataSource={detailsRows}
      pagination={false}
    />
  );
};

export default observer(Details);
