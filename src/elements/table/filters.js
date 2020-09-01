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
    disabled,
  },
) => {
  const type = typeVal.toLowerCase();
  switch (type) {
    case 'daterange':
      return <DataRangePicker disabled={disabled} title={title} onChange={onChange} value={value} />;
    case 'costrange':
      return <CostRangeInput disabled={disabled} title={title} onChange={onChange} value={value} />;
    case 'text':
      return <Input disabled={disabled} placeholder={title} onChange={({ target }) => onChange(target.value)} value={value} />;
    case 'selector': case 'singleselector': {
      const isSingle = type === 'singleselector';
      if (selector.length <= 1) {
        return null;
      }
      return <Select disabled={disabled} title={title} value={value} onChange={onChange} selector={selector} isSingle={isSingle} />;
    }
    case 'checkbox':
      return <Checkbox disabled={disabled} checked={value} onChange={({ target: { checked } }) => onChange(checked)}>{title}</Checkbox>;
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
          title, selector, type, key, disabled,
        }) => {
          const onChange = (value) => { filter.set(key, value); };
          const value = filter.get(key);
          const isDisabled = typeof disabled === 'function' ? disabled(filter) : disabled;
          return (
            <Filter
              key={key}
              title={title}
              selector={selector ? selector(filter) : []}
              type={type}
              onChange={onChange}
              value={value}
              disabled={isDisabled}
            />
          );
        })
      }
    </div>
  </div>
);

export default inject('filter')(observer(Filters));
