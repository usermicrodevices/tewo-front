import React from 'react';

import GenericPage from 'elements/genericPage';

import { UserOverview, UserOverviewActions } from 'components/user/overview';

const UsersList = () => (
  <GenericPage
    storageName="users"
    tableTitle="Пользователи"
    allLinkText="Список пользователей"
    overview={UserOverview}
    overviewActions={UserOverviewActions}
    overviewSubmenu={[
      {
        path: '',
        text: 'Объекты',
      },
      {
        path: ['view', 'edit'],
        text: 'Общая информация',
      },
    ]}
  />
);

export default UsersList;
