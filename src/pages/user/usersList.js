import React from 'react';

import GenericPage from 'elements/genericPage';

const Dummy = () => <div>user</div>;

const UsersList = () => (
  <GenericPage
    storageName="users"
    tableTitle="Пользователи"
    allLinkText="Список пользователей"
    overview={Dummy}
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
