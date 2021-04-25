import React from 'react';
import { inject, Provider } from 'mobx-react';

import Typography from 'elements/typography';
import { FiltersButton } from 'elements/filters';
import Card from 'elements/card';
import { SubpageHeader } from 'elements/headers';
import Packages from 'components/packages';

const Session = ({ manager }) => (
  <>
    <SubpageHeader>
      <Typography.Title level={1}>
        Загрузки пакета обновления оборудования
      </Typography.Title>
      <Provider filter={manager.devices.filter}><FiltersButton /></Provider>
    </SubpageHeader>
    <Card>
      <Packages />
    </Card>
  </>
);

export default inject('manager')(Session);
