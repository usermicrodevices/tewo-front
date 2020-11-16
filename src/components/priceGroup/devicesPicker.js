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
  const [companies, setCompanies] = useState([]);
  const [points, setSalePoint] = useState([]);
  const companiesSet = companies.length === 0 ? { has: () => true } : new Set(companies);
  const pointsSet = points.length === 0 ? { has: () => true } : new Set(points);
  const skipSet = new Set(element.devices.map(({ id }) => id));
  const ds = session.devices.isLoaded ? session.devices.rawData
    .filter(({
      id, salePointId, salePoint, name,
    }) => (
      name.toLowerCase().indexOf(search) >= 0
      && !skipSet.has(id)
      && (!salePoint || companiesSet.has(salePoint.companyId))
      && pointsSet.has(salePointId)
    ))
    .map(({ id, name, salePointName }) => ({
      key: id, name, salePointName,
    })) : undefined;
  return (
    <div>
      <div className={classes.inputs}>
        <Input allowClear prefix={<Icon name="search-outline" />} value={searchText} onChange={({ target }) => setSearch(target.value)} />
        <Select title="Компания" value={companies} onChange={setCompanies} selector={session.companies.selector} />
        <Select title="Объект" value={points} onChange={setSalePoint} selector={session.points.selector} />
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
        }}
        dataSource={ds}
      />
    </div>
  );
};

export default inject('element', 'session')(observer(DevicePicker));
