import React from 'react';
import { inject, observer } from 'mobx-react';

import GenericPage from 'pages/genericPage';

import { SalePointOverview, SalePointTitleAction } from 'components/salePoint';

const Points = () => (
  <GenericPage
    storageName="points"
    tableTitle="Список объектов"
    allLinkText="Все объекты"
    overview={SalePointOverview}
    overviewActions={SalePointTitleAction}
    overviewSubmenu={[
      {
        path: '',
        text: 'Сводная информация',
      },
      {
        path: ['view', 'edit'],
        text: 'Справочная информация',
        explains: '',
      },
    ]}
  />
);

export default inject('session')(observer(Points));
