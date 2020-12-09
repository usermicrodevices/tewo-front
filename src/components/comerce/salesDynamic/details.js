import React from 'react';
import { observer } from 'mobx-react';
import Loader from 'elements/loader';
import { Table } from 'antd';

import { rangeMetricCompareCell, explainedTitleCell } from 'elements/table/trickyCells';
import Format from 'elements/format';

import classNames from './index.module.scss';

const comparator = (a, b) => {
  const getProgress = ({ cur, prw }) => {
    if (typeof prw !== 'number' || prw === 0) {
      return Infinity;
    }
    return (cur - prw) / prw;
  };
  return getProgress(b) - getProgress(a);
};

const columns = (width) => [
  {
    title: 'Напиток',
    dataIndex: 'name',
    render: (name) => <Format>{name}</Format>,
    width: width[0] + width[1],
  },
  {
    title: explainedTitleCell('Продажи', '(текущий / предыдущий / %)'),
    dataIndex: 'deltaSales',
    render: (_, row) => rangeMetricCompareCell(row.sales),
    width: width[2],
    sorter: (a, b) => comparator(a.sales, b.sales),
  },
  {
    title: explainedTitleCell('Наливы', '(текущий / предыдущий / %)'),
    dataIndex: 'deltaBeverages',
    render: (_, row) => rangeMetricCompareCell(row.beverages),
    width: width[3],
    sorter: (a, b) => comparator(a.beverages, b.beverages),
  },
];

const Details = ({ columnWidth, _, item }) => {
  if (!item.isDetailsLoaded) {
    return <div className={classNames.loader}><Loader size="large" /></div>;
  }
  const { details: { rows } } = item;
  return (
    <Table
      className={classNames.details}
      columns={columns(columnWidth)}
      dataSource={rows}
      pagination={false}
    />
  );
};

export default observer(Details);
