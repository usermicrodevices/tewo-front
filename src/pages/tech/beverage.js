import React from 'react';

import GenericTablePage from 'pages/genericTablePage';
import BeverageComponent from 'components/beverage';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Beverage = () => (
  <GenericTablePage
    refreshInterval={beveragesAndEventsUpdateFrequency}
    storageName="beverages"
    isNotEditable
  >
    <BeverageComponent />
  </GenericTablePage>
);

export default Beverage;
