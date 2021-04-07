import React from 'react';

import GenericPage from 'elements/genericPage';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Events = () => (
  <GenericPage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="events"
    isHaveNotOverview
    tableTitle="Журнал событий"
  />
);

export default Events;
