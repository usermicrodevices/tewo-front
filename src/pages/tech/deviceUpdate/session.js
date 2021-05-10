import React from 'react';
import { inject } from 'mobx-react';

import Typography from 'elements/typography';
import Card from 'elements/card';
import { SubpageHeader } from 'elements/headers';
import Packages from 'components/packages';

const Session = ({ manager }) => (
  <>
    <SubpageHeader>
      <Typography.Title level={1}>
        Загрузки пакета обновления оборудования
      </Typography.Title>
    </SubpageHeader>
    <Card>
      <Packages />
    </Card>
  </>
);

export default inject('manager')(Session);
