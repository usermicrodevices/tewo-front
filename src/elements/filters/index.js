import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Checkbox, Dropdown, Input,
} from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';

import TagSelect from 'components/tags/select';

import DataRangePicker from './daterangepicker';
import CostRangeInput from './costrangeinput';
import Select from './select';
import Salepoints from './salePoints';

import style from './style.module.scss';

export const Filter = (
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
    case 'daterange': {
      return <DataRangePicker disabled={disabled} title={title} onChange={onChange} value={value} />;
    }
    case 'costrange':
      return <CostRangeInput disabled={disabled} title={title} onChange={onChange} value={value} />;
    case 'text':
      return <Input allowClear disabled={disabled} placeholder={title} onChange={({ target }) => onChange(target.value)} value={value} />;
    case 'salepoints':
      return <Salepoints minWidth={330} disabled={disabled} value={value} onChange={onChange} />;
    case 'selector': case 'singleselector': {
      const isSingle = type === 'singleselector';
      return <Select minWidth={330} disabled={disabled} title={title} value={value} onChange={onChange} selector={selector} isSingle={isSingle} />;
    }
    case 'tag':
      return <TagSelect minWidth={330} disabled={disabled} title={title} value={value} onChange={onChange} />;
    case 'checkbox':
      return <Checkbox disabled={disabled} checked={value} onChange={({ target: { checked } }) => onChange(checked)}>{title}</Checkbox>;
    default:
      console.error(`unknown filter type ${type}`);
      return null;
  }
};

const Filters = inject('filter')(observer(({ filter }) => (
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
)));

const FiltersButton = inject('filter')(observer(({ filter }) => (
  <Dropdown trigger={['click']} overlay={<Filters />} placement="bottomLeft">
    <Button
      type={filter.search !== '' ? 'primary' : 'default'}
      icon={<FilterOutlined />}
    >
      Фильтрация
    </Button>
  </Dropdown>
)));

export { Filters as default, FiltersButton };
