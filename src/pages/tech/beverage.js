import React from 'react';

import GenericPage from 'elements/genericPage';
import BeverageIndicatorsModal from 'components/beverageIndicatorsModal';

import { beveragesAndEventsUpdateFrequency } from 'config';

const Beverage = () => (
  <>
    <BeverageIndicatorsModal />
    <GenericPage
      refreshInterval={beveragesAndEventsUpdateFrequency}
      storageName="beverages"
      isHaveNotOverview
      tableTitle="Журнал наливов"
    />
  </>
);

export default Beverage;
