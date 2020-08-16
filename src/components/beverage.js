import React from 'react';
import { Space } from 'antd';
import { inject, observer, Provider } from 'mobx-react';
import { Link } from 'react-router-dom';

import Card from 'elements/card';
import Icon from 'elements/icon';
import Table from 'elements/table';
import Title from 'components/title';

const companiesSubmenu = [
  {
    path: '/companies',
    text: 'Каталог',
  },
];

const Beverage = ({ session }) => (
  <>
    <Title tabs={companiesSubmenu}>
      <Space>
        Все компании
        <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
      </Space>
    </Title>
    <Card>
      <Provider table={session.beverages} filter={session.beverages.filter}>
        <Table />
      </Provider>
    </Card>
  </>
);

export default inject('session')(observer(Beverage));
