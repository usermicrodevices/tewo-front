import React from 'react';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Badge from 'elements/badged';
import { durationCell } from 'elements/table/trickyCells';

import tableWidget from '../tableWidget';

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'salePoint',
    render: (point) => (
      point ? <Badge size={8}><Format>{point.name}</Format></Badge> : <Loader />
    ),
    sorter: (a, b) => {
      if (a.salePoint && b.salePoint) {
        return a.salePoint.name.localeCompare(b.salePoint.name) || a.key - b.key;
      }
      if (b.salePoint) {
        return -1;
      }
      if (a.salePoint) {
        return 1;
      }
      return a.key - b.key;
    },
  },
  {
    title: 'Оборудование',
    dataIndex: 'deviceName',
    render: (v) => <Badge><Format>{v}</Format></Badge>,
    sorter: (a, b) => a.deviceName.localeCompare(b.deviceName) || a.key - b.key,
  },
  {
    title: 'Выключено',
    dataIndex: 'timeInfo',
    render: durationCell,
    sorter: (a, b) => {
      if (b.timeInfo.openDate.isValid() && a.timeInfo.openDate.isValid()) {
        return a.timeInfo.openDate - b.timeInfo.openDate;
      }
      if (b.timeInfo.openDate.isValid()) {
        return -1;
      }
      if (a.timeInfo.openDate.isValid()) {
        return 1;
      }
      return a.key - b.key;
    },
  },
]);

export default FavoriteObjects;
