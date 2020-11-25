import React from 'react';

import GenericPage from 'elements/genericPage';

import MailingOverview from 'components/mailing';

const Mailings = () => (
  <GenericPage
    storageName="mailings"
    tableTitle="Email рассылки"
    allLinkText="Список email рассылок"
    overview={MailingOverview}
    overviewSubmenu={[
      {
        path: '',
        text: 'Настройка уведомлений',
      },
      {
        path: ['view', 'edit'],
        text: 'Справочная информация',
      },
    ]}
  />
);

export default Mailings;
