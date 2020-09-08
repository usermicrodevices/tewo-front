import React from 'react';
import { Link } from 'react-router-dom';
import { Space } from 'antd';

import GenericPage from 'pages/genericPage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';
import Icon from 'elements/icon';
import { companiesSubmenu } from 'routes';

const Companies = () => (
  <GenericPage storageName="costs">
    <Title tabs={companiesSubmenu}>
      <Space>
        Группы цен
        <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
      </Space>
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericPage>
);

export default Companies;
