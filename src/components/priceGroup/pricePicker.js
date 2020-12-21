import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';

import SelectableTable from 'elements/table/selectableTable';
import Icon from 'elements/icon';

import classes from './pickers.module.scss';

const PricePicker = ({
  session, element, onSelect,
}) => {
  const skipSet = new Set(element.prices.map(({ drinkId }) => drinkId));
  const [searchText, setSearch] = useState('');
  const search = searchText.toLowerCase();

  const ds = session.drinks.isLoaded ? session.drinks.rawData
    .filter(({ name, id }) => !skipSet.has(id) && name.toLowerCase().indexOf(search) >= 0)
    .map(({ id, name, plu }) => ({
      key: id,
      name,
      plu,
    })) : undefined;

  return (
    <div>
      <div className={classes.inputs}>
        <Input placeholder="Поиск" allowClear prefix={<Icon name="search-outline" />} value={searchText} onChange={({ target }) => { setSearch(target.value); }} />
      </div>
      <SelectableTable
        className={classes.table}
        onSelect={onSelect}
        columns={{
          name: {
            title: 'Название',
            grow: 2,
          },
          plu: {
            title: 'PLU',
            width: 100,
          },
        }}
        dataSource={ds}
      />
    </div>
  );
};

export default inject('session', 'element')(observer(PricePicker));
