import React from 'react';

import GenericTablePage from 'pages/genericTablePage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

const Companies = () => (
  <GenericTablePage storageName="points">
    <Title>
      Объекты
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericTablePage>
);

export default Companies;
