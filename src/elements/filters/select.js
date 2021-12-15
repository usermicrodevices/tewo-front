import React from 'react';
import { Select } from 'antd';
import Loader from 'elements/loader';

const { Option } = Select;

const filterComparator = (inputValue, { children }) => children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

const Selector = ({
  title, value, onChange, selector, isSingle, disabled, disallowClear, minWidth, tagRender,
}) => {
  const titleWidget = Array.isArray(selector) ? title : (
    <Loader />
  );
  return (
    <Select
      style={{ minWidth: minWidth || 150 }}
      placeholder={titleWidget}
      onChange={onChange}
      mode={isSingle ? undefined : 'multiple'}
      value={value}
      allowClear={!disallowClear}
      showSearch
      filterOption={filterComparator}
      disabled={disabled || !Array.isArray(selector) || selector.length === 0}
      notFoundContent={<Loader />}
      tagRender={Array.isArray(value) && value.length > 0 ? tagRender : undefined}
    >
      {
        Array.isArray(selector) && selector.map(([key, text]) => (
          <Option key={key} value={key}>
            {text}
          </Option>
        ))
      }
    </Select>
  );
};

export default Selector;
