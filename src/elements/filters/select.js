import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const filterComparator = (inputValue, { children }) => children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

const Selector = ({
  title, value, onChange, selector, resolver, isSingle, disabled,
}) => (
  <Select
    style={{ minWidth: 150 }}
    placeholder={title}
    onChange={onChange}
    mode={isSingle ? undefined : 'multiple'}
    value={value}
    allowClear
    loading={selector.length === 0}
    showSearch
    filterOption={filterComparator}
    disabled={disabled}
  >
    {
      selector.map(([key, text]) => (
        <Option key={key} value={key}>
          {text}
        </Option>
      ))
    }
  </Select>
);

export default Selector;
