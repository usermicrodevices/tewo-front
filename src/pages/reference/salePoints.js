import React from 'react';
import { inject, observer } from 'mobx-react';
import { Space, Button } from 'antd';

import GenericTablePage from 'pages/genericTablePage';
import Card from 'elements/card';
import Table from 'elements/table';
import Title from 'components/title';
import Icon from 'elements/icon';

const Companies = ({ session }) => (
  <GenericTablePage storageName="points">
    <Title>
      <Space>
        Все компании
        <Button onClick={() => { session.points.create(); }} icon={<Icon size={22} name="plus-circle-outline" />} type="text" />
      </Space>
    </Title>
    <Card>
      <Table />
    </Card>
  </GenericTablePage>
);

export default inject('session')(observer(Companies));
