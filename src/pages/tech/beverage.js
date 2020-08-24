import React from 'react';

import GenericTablePage from 'pages/genericTablePage';
import BeverageComponent from 'components/beverage';

const Beverage = () => (
  <GenericTablePage
    refreshInterval={3000}
    storageName="beverages"
    isNotEditable
  >
    <BeverageComponent />
  </GenericTablePage>
);

export default Beverage;
