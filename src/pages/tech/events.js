import React from 'react';

import { Space } from 'antd';

import GenericPage from 'pages/genericPage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Events = () => (
  <GenericPage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="events"
    isNotEditable
  >
    <Title>
      <Space>
        События
      </Space>
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericPage>
);

export default Events;
