import { Table } from 'antd';
import React from 'react';

import Format from 'elements/format';
import Loader from 'elements/loader';

import classNames from './subtable.module.scss';

const columns = (width) => [
  {
    title: 'Пакет',
    dataIndex: 'name',
    render: (name) => <Format>{name}</Format>,
  },
  {
    title: 'Описание',
    dataIndex: 'description',
    render: (name) => <Format>{name}</Format>,
  },
];

const Subtable = ({ columnWidth, _, item }) => {
  if (!item.isDetailsLoaded) {
    return <div className={classNames.loader}><Loader size="large" /></div>;
  }
  const { detailsRows } = item;
  return (
    <Table
      className={classNames.details}
      columns={columns(columnWidth)}
      dataSource={detailsRows}
      pagination={false}
    />
  );
};

export default Subtable;
