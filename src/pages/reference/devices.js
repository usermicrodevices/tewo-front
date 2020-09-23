import React from 'react';

import GenericPage from 'pages/genericPage';

import { DeviceOverview, DeviceTitleAction } from 'components/device';

const Devices = () => (
  <GenericPage
    storageName="devices"
    tableTitle="Оборудование"
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
      {
        path: 'voltage',
        text: 'История напряжений',
      },
    ]}
  />
);

export default Devices;
