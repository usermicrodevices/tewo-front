import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const Selector = ({
  title, value, onChange, selector, resolver,
}) => (
  <Select
    style={{ minWidth: 150 }}
    placeholder={title}
    onChange={onChange}
    mode="multiple"
    value={value}
  >
    {
      selector.map((key) => (
        <Option key={key} value={key} disabled={!resolver[key]}>
          {resolver[key] || key}
        </Option>
      ))
    }
  </Select>
);

export default Selector;
