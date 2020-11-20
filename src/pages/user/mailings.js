import React from 'react';

import GenericPage from 'elements/genericPage';

const Dummy = () => <div>Dummy</div>;

const Mailings = () => (
  <GenericPage
    storageName="mailings"
    tableTitle="Email рассылки"
    allLinkText="Список email рассылок"
    overview={Dummy}
  />
);

export default Mailings;
