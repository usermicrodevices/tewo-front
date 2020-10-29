import React from 'react';

import Format from 'elements/format';
import Badge from 'elements/badged';

import tableWidget from '../tableWidget';

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'label',
    render: ({ stateColor, name }) => <Badge size={8} stateColor={stateColor}><Format>{name}</Format></Badge>,
  },
  {
    title: 'Кол-во наливов',
    dataIndex: 'beverages',
    render: (v) => <Format>{v}</Format>,
  },
]);

export default FavoriteObjects;