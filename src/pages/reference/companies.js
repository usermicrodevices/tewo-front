import React from 'react';
import { Link } from 'react-router-dom';
import { Space } from 'antd';

import GenericTablePage from 'pages/genericTablePage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';
import Icon from 'elements/icon';
import { companiesSubmenu } from 'routes';

const Companies = () => (
  <GenericTablePage storageName="companies">
    <Title tabs={companiesSubmenu}>
      <Space>
        Все компании
        <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
      </Space>
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericTablePage>
);

export default Companies;
