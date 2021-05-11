import React from 'react';
import { inject } from 'mobx-react';

import Typography from 'elements/typography';
import { SubpageHeader } from 'elements/headers';
import Packages from 'components/packages';

const Session = ({ manager }) => (
  <>
    <SubpageHeader>
      <Typography.Title level={1}>
        Загрузки пакета обновления оборудования
      </Typography.Title>
    </SubpageHeader>
    <Packages />
  </>
);

export default inject('manager')(Session);
