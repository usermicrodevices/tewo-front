import React from 'react';
import { Space } from 'antd';

import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

import GenericTablePage from 'pages/genericTablePage';

const Devices = () => (
  <GenericTablePage storageName="ingredients">
    <Title>
      <Space>
        Ингридиенты
      </Space>
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericTablePage>
);

export default Devices;
