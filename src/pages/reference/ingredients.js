import React from 'react';
import { Space } from 'antd';

import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

import GenericPage from 'pages/genericPage';

const Devices = () => (
  <GenericPage storageName="ingredients">
    <Title>
      <Space>
        Ингридиенты
      </Space>
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericPage>
);

export default Devices;
