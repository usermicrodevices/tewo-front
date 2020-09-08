import React from 'react';

import GenericPage from 'pages/genericPage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Beverage = () => (
  <GenericPage
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
  </GenericPage>
);

export default Beverage;
