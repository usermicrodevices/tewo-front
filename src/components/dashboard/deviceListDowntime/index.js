import React from 'react';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Badge from 'elements/salePointBadge';

import tableWidget from '../tableWidget';

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'salePoint',
    render: (point) => (
      point ? <Badge stateColor={point.stateColor}><Format>{point.name}</Format></Badge> : <Loader />
    ),
  },
  {
    title: 'Длительность простоя',
    dataIndex: 'duration',
    render: (v) => <Format>{undefined}</Format>,
  },
  {
    title: '',
    dataIndex: 'explains',
    render: (v) => <Format>{undefined}</Format>,
  },
]);

export default FavoriteObjects;
