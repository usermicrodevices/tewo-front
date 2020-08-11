import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Checkbox, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import DataRangePicker from 'elements/filters/daterangepicker';
import CostRangeInput from 'elements/filters/costrangeinput';
import Select from 'elements/filters/select';

import style from './style.module.scss';

const Filter = (
  {
    type, title, selector, resolver,
  },
) => {
  const [value, onChange] = useState(0);
  switch (type.toLowerCase()) {
    case 'daterange':
      return <DataRangePicker title={title} onChange={onChange} value={value} />;
    case 'costrange':
      return <CostRangeInput title={title} onChange={onChange} value={value} />;
    case 'text':
      return <Input placeholder={title} onChange={onChange} value={value} />;
    case 'selector':
      return <Select title={title} value={value} onChange={onChange} selector={selector} resolver={resolver} />;
    case 'checkbox':
      return <Checkbox checked={value} onChange={onChange}>{title}</Checkbox>;
    default:
      console.error(`unknown filter type ${type}`);
      return null;
  }
};
const Filters = ({ table }) => (
  <div className={style['filters-block']}>
    <Button type="text" icon={<ReloadOutlined />} onClick={() => console.log('clear')}>Сбросить</Button>
    <div className={style.filters}>
      {
        table.allColumns.filter(({ filter }) => filter).map(({ key, filter }) => (
          <Filter
            key={key}
            title={filter.title}
            selector={filter.selector}
            type={filter.type}
            resolver={filter.resolver}
          />
        ))
      }
    </div>
  </div>
);

export default inject('table')(observer(Filters));
