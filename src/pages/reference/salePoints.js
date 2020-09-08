import React from 'react';
import { inject, observer } from 'mobx-react';

import GenericPage from 'pages/genericPage';

const Points = () => (
  <GenericPage
    storageName="points"
    tableTitle="Список объектов"
    subrout={{}}
  />
);

export default inject('session')(observer(Points));
