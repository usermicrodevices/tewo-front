import React from 'react';

import GenericPage from 'elements/genericPage';

import UserOverview from 'components/user';

const UsersList = () => (
  <GenericPage
    storageName="users"
    tableTitle="Пользователи"
    allLinkText="Список пользователей"
    overview={UserOverview}
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
