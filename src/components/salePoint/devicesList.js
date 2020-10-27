import React from 'react';
import { Card, Table } from 'antd';
import { inject, observer } from 'mobx-react';

import Loader from 'elements/loader';
import Typography from 'elements/typography';
import { tableItemLink } from 'elements/table/trickyCells';

import style from './devicesList.module.scss';

const COLUMNS = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Название',
    dataIndex: 'name',
    render: (name, data) => tableItemLink(name, data.path),
  },
];

const DeviceList = ({ element: { details: { devices, devicesPath } } }) => (
  <Card className={style.root}>
    <Typography.Title level={3}>Оборудование</Typography.Title>
    {
      (() => {
        if (!Array.isArray(devices)) {
          return <Loader />;
        }
        const data = devices.map(({ id, name }) => ({
          id, name, path: `${devicesPath}/${id}`, key: id,
        }));
        return <Table pagination={false} columns={COLUMNS} dataSource={data} />;
      })()
    }
  </Card>
);

export default inject('element')(observer(DeviceList));
