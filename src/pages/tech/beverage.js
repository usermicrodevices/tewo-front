import React from 'react';

import GenericPage from 'pages/genericPage';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Beverage = () => (
  <GenericPage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="beverages"
    isNotEditable
    tableTitle="Наливы"
  />
);

export default Beverage;
