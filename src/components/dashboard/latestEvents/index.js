import React from 'react';
import { Typography } from 'antd';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Badge from 'elements/badged';
import { durationCell } from 'elements/table/trickyCells';

import tableWidget from '../tableWidget';

const { Text } = Typography;

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'salePoint',
    render: (salePoint) => (
      salePoint
        ? <Badge size={8}><Typography.Title level={4}>{salePoint.name}</Typography.Title></Badge>
        : <Loader />
    ),
  },
  {
    title: 'Событие',
    dataIndex: 'eventName',
    render: (v) => <Format><Text>{v}</Text></Format>,
  },
  {
    title: 'Дата события и длительность',
    dataIndex: 'timeInfo',
    render: durationCell,
  },
]);

export default FavoriteObjects;
