import React from 'react';

import GenericPage from 'elements/genericPage';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Beverage = () => (
  <GenericPage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="beverages"
    isHaveNotOverview
    tableTitle="Наливы"
  />
);

export default Beverage;
