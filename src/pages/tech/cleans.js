/* eslint class-methods-use-this: "off" */
import React, { useState } from 'react';
import { Space } from 'antd';
import { inject, observer, Provider } from 'mobx-react';
import { Link } from 'react-router-dom';

import Card from 'elements/card';
import Icon from 'elements/icon';
import Table from 'elements/table';
import Title from 'components/title';
import TableModel from 'models/table';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    isAsyncorder: true,
  },
  device_date: {
    isVisibleByDefault: true,
    title: 'Момент налива',
    grow: 1,
    isDefaultSort: true,
    transform: (date) => date,
    filter: {
      type: 'dateRange',
      title: 'Момент налива',
    },
    sortDirections: 'both',
  },
};

class CleansModel extends TableModel {
  constructor() {
    super(COLUMNS, () => Promise.resolve({ count: 0, results: [] }));
  }

  toString() {
    return 'Cleans';
  }
}

const companiesSubmenu = [
  {
    path: '/companies',
    text: 'Каталог',
  },
];

const Cleans = ({ session }) => {
  const [table] = useState(new CleansModel());
  return (
    <>
      <Title tabs={companiesSubmenu}>
        <Space>
          Все компании
          <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
        </Space>
      </Title>
      <Card>
        <Provider table={table} filter={table.filter}>
          <Table />
        </Provider>
      </Card>
    </>
  );
};

export default inject('session')(observer(Cleans));
