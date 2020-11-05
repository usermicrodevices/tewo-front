import React from 'react';

import GenericPage from 'elements/genericPage';

import { PriceGroupOverview, PriceGroupTitleAction } from 'components/priceGroup';

const PriceLists = () => (
  <GenericPage
    storageName="priceGroups"
    tableTitle="Группы цен"
    allLinkText="Группы цен"
    overview={PriceGroupOverview}
    overviewActions={PriceGroupTitleAction}
    overviewSubmenu={[]}
    isNotEditable
  />
);

export default PriceLists;
