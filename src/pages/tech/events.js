import React from 'react';

import GenericPage from 'pages/genericPage';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Events = () => (
  <GenericPage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="events"
    isHaveNotOverview
    tableTitle="События"
  />
);

export default Events;
