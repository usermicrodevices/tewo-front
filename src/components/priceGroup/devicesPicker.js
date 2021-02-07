import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';

import Icon from 'elements/icon';
import Select from 'elements/filters/select';
import SelectableTable from 'elements/table/selectableTable';

import classes from './pickers.module.scss';

const DevicePicker = ({ element, session, onSelect }) => {
  const [searchText, setSearch] = useState('');
  const search = searchText.toLowerCase();
  const [points, setSalePoint] = useState([]);
  const pointsSet = points.length === 0 ? { has: () => true } : new Set(points);
  const skipSet = new Set(element.devices.map(({ id }) => id));
  const ds = session.devices.isLoaded ? session.devices.rawData
    .filter(({
      id, salePointId, salePoint, name, companyId,
    }) => (
      name.toLowerCase().indexOf(search) >= 0
      && !skipSet.has(id)
      && (!salePoint || salePoint.companyId === element.companyId)
      && pointsSet.has(salePointId)
      && companyId === element.companyId
    ))
    .map(({
      id, name, salePointName, priceGroupName,
    }) => ({
      key: id, name, salePointName, priceGroupName,
    })) : undefined;
  const salePointsSelector = (session.points.rawData || [])
    .filter(({ companyId }) => companyId === element.companyId)
    .map(({ id, name }) => [id, name]);
  return (
    <div>
      <div className={classes.inputs}>
        <Input placeholder="Поиск" allowClear prefix={<Icon name="search-outline" />} value={searchText} onChange={({ target }) => setSearch(target.value)} />
        <Select title="Объект" value={points} onChange={setSalePoint} selector={salePointsSelector} />
      </div>
      <SelectableTable
        className={classes.table}
        onSelect={onSelect}
        columns={{
          name: {
            title: 'Название',
            grow: 2,
          },
          salePointName: {
            title: 'Объект',
            grow: 2,
          },
          priceGroupName: {
            title: 'Уже назначенная группа цен',
            grow: 3,
          },
        }}
        dataSource={ds}
      />
    </div>
  );
};

export default inject('element', 'session')(observer(DevicePicker));
