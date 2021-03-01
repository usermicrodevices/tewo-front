import React from 'react';
import { Typography } from 'antd';
import moment from 'moment';

import { formatDuration } from 'utils/date';
import Format from 'elements/format';

import tableWidget from '../tableWidget';

const localeComparator = (field) => (a, b) => {
  if (typeof a[field] === 'string' && typeof b[field] === 'string') {
    return a[field].localeCompare(b[field]) || a.key - b.key;
  }
  return a.key - b.key;
};

const FavoriteObjects = tableWidget([
  {
    title: 'Объект',
    dataIndex: 'salePointName',
    sorter: localeComparator('salePointName'),
  },
  {
    title: 'Оборудование',
    dataIndex: 'name',
    sorter: localeComparator('name'),
  },
  {
    title: 'Длительность',
    dataIndex: 'unused',
    sorter: (a, b) => a.unused - b.unused || a.key - b.key,
    render: (unused) => (
      <Typography.Text>
        <Format>
          {formatDuration(moment.duration(unused, 'millisecond'))}
        </Format>
      </Typography.Text>
    ),
    defaultSortOrder: 'descend',
  },
]);

export default FavoriteObjects;
