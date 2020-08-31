import React from 'react';

import GenericTablePage from 'pages/genericTablePage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Beverage = () => (
  <GenericTablePage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="beverages"
    isNotEditable
  >
    <Title>
      Наливы
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericTablePage>
);

export default Beverage;
