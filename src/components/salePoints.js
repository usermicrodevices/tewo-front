import React from 'react';
import { inject, observer, Provider } from 'mobx-react';

import Title from 'components/title';
import Card from 'elements/card';
import Table from 'elements/table';

const SaleModel = ({ salePoints }) => (
  <>
    <Title>
      Объекты
    </Title>
    <Card>
      <Provider table={salePoints}>
        <Table />
      </Provider>
    </Card>
  </>
);

export default inject('salePoints')(observer(SaleModel));
