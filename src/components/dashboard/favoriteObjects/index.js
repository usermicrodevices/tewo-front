import React from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import Badge from 'elements/badged';
import NoData from 'elements/noData';

import tableWidget from '../tableWidget';

import classnames from './index.module.scss';

const TableWidget = tableWidget([
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

const FavoriteObjects = inject('storage')(observer(({ storage }) => {
  if (storage.data === null) {
    return (
      <div className={classnames.index}>
        <NoData title="Ни один объект не является избранным" text="Для настройки избранных объектов воспользуйтесь мобильным приложением" />
      </div>
    );
  }
  return <TableWidget />;
}));

export default FavoriteObjects;
