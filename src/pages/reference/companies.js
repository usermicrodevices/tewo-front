import React from 'react';

import GenericPage from 'pages/genericPage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';
import { companiesSubmenu } from 'routes';

const Companies = () => (
  <GenericPage storageName="companies">
    <Title tabs={companiesSubmenu}>
      Все компании
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericPage>
);

export default Companies;
