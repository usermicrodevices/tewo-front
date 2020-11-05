import React from 'react';

import GenericPage from 'elements/genericPage';

import { DeviceOverview, DeviceTitleAction } from 'components/device';

const Devices = () => (
  <GenericPage
    storageName="devices"
    tableTitle="Всё оборудование"
    overview={DeviceOverview}
    overviewActions={DeviceTitleAction}
    allLinkText="Всё оборудование"
    overviewSubmenu={[
      {
        path: ['', 'calendar'],
        text: 'Техническая информация',
      },
      {
        path: 'commerce',
        text: 'Комммерческая информация',
      },
      {
        path: ['view', 'edit'],
        text: 'Справочная информация',
      },
    ]}
  />
);

export default Devices;
