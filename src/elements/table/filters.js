import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Checkbox, Input } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import DataRangePicker from 'elements/filters/daterangepicker';
import CostRangeInput from 'elements/filters/costrangeinput';
import Select from 'elements/filters/select';

import style from './style.module.scss';

const Filter = (
  {
    type: typeVal,
    title,
    selector,
    onChange,
    value,
  },
) => {
  const type = typeVal.toLowerCase();
  switch (type) {
    case 'daterange':
      return <DataRangePicker title={title} onChange={onChange} value={value} />;
    case 'costrange':
      return <CostRangeInput title={title} onChange={onChange} value={value} />;
    case 'text':
      return <Input placeholder={title} onChange={onChange} value={value} />;
    case 'selector':
      return <Select title={title} value={value} onChange={onChange} selector={selector} />;
    case 'checkbox':
      return <Checkbox checked={value} onChange={onChange}>{title}</Checkbox>;
    default:
      console.error(`unknown filter type ${type}`);
      return null;
  }
};

const Filters = ({ filter }) => (
  <div className={style['filters-block']}>
    <Button type="text" icon={<ReloadOutlined />} onClick={() => { filter.clear(); }}>Сбросить</Button>
    <div className={style.filters}>
      {
        filter.elements.map(({
          title, selector, type, key,
        }) => {
          const onChange = (value) => { filter.set(key, value); };
          const value = filter.get(key);
          return (
            <Filter
              key={key}
              title={title}
              selector={selector ? selector() : []}
              type={type}
              onChange={onChange}
              value={value}
            />
          );
        })
      }
    </div>
  </div>
);

export default inject('filter')(observer(Filters));
