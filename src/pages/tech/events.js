import React from 'react';

import { Space } from 'antd';

import GenericTablePage from 'pages/genericTablePage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Events = () => (
  <GenericTablePage
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
  </GenericTablePage>
);

export default Events;
