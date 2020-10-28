import React from 'react';

import Format from 'elements/format';
import Loader from 'elements/loader';
import { typeNameToIcon } from 'elements/beverageIcons';
import Badge from 'elements/badged';

import tableWidget from '../tableWidget';

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'device',
    render: (device) => (
      device && device.salePoint ? <Badge size={8} stateColor={device.salePoint.stateColor}><Format>{device.salePointName}</Format></Badge> : <Loader />
    ),
  },
  {
    title: 'Напиток',
    dataIndex: 'drinkName',
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: 'Дата налива',
    dataIndex: 'deviceDate',
    render: (v) => <Format>{v.format('d MMMM, hh:mm')}</Format>,
  },
  {
    title: '',
    dataIndex: 'operationName',
    render: (v) => <Format>{typeNameToIcon(v)}</Format>,
  },
]);

export default FavoriteObjects;
