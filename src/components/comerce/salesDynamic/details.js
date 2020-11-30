import React from 'react';
import { observer } from 'mobx-react';
import Loader from 'elements/loader';
import { Table } from 'antd';

import { rangeMetricCompareCell, explainedTitleCell } from 'elements/table/trickyCells';
import Format from 'elements/format';

import classNames from './index.module.scss';

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
  },
  {
    title: explainedTitleCell('Наливы', '(текущий / предыдущий / %)'),
    dataIndex: 'deltaBeverages',
    render: (_, row) => rangeMetricCompareCell(row.beverages),
    width: width[3],
  },
];

const Details = ({ columnWidth, _, item }) => {
  if (!item.isDetailsLoaded) {
    return <div className={classNames.loader}><Loader size="large" /></div>;
  }
  const { details: { rows } } = item;
  return (
    <Table
      columns={columns(columnWidth)}
      dataSource={rows}
      pagination={false}
    />
  );
};

export default observer(Details);
