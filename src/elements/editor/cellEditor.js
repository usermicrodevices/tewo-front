import React from 'react';
import {
  Input, Form, Select, InputNumber, Checkbox, DatePicker,
} from 'antd';

import IngredientsPicker from './ingredientspicker';
import LocationPicker from './locationpicker';
import ColorPicker from './colorpicker';

const CellEditor = ({
  editor: {
    type, selector, isMultiple, rows,
  },
  name,
}) => {
  switch (type) {
    case 'text': case 'email': {
      return (
        <Form.Item name={name}>
          { rows ? <Input.TextArea rows={rows} /> : <Input /> }
        </Form.Item>
      );
    }
    case 'color': {
      return (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues[name] !== currentValues[name]}
        >
          {({ getFieldValue, setFieldsValue }) => (
            <ColorPicker name={name} getFieldValue={getFieldValue} setFieldsValue={setFieldsValue} />
          )}
        </Form.Item>
      );
    }
    case 'number': {
      return (
        <Form.Item name={name}>
          <InputNumber />
        </Form.Item>
      );
    }
    case 'phone': {
      const phoneSelector = (
        <Select defaultValue="ru" style={{ width: 70 }} disabled>
          <Select.Option value="ru">+7</Select.Option>
        </Select>
      );
      return (
        <Form.Item name={name}>
          <Input addonBefore={phoneSelector} />
        </Form.Item>
      );
    }
    case 'location': {
      return (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues[name] !== currentValues[name]}
        >
          {({ getFieldValue, setFieldsValue }) => (
            <LocationPicker getFieldValue={getFieldValue} setFieldsValue={setFieldsValue} name={name} />
          )}
        </Form.Item>
      );
    }
    case 'date':
      return (
        <Form.Item name={name}>
          <DatePicker />
        </Form.Item>
      );
    case 'ingredients':
      return (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => JSON.stringify(prevValues[name]) !== JSON.stringify(currentValues[name])}
        >
          {({ getFieldValue, setFieldsValue }) => (
            <IngredientsPicker getFieldValue={getFieldValue} setFieldsValue={setFieldsValue} name={name} />
          )}
        </Form.Item>
      );
    case 'selector': {
      const filterComparator = (inputValue, { children }) => children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
      return (
        <Form.Item name={name} shouldUpdate>
          <Select
            showSearch
            filterOption={filterComparator}
            placeholder="Значение не задано"
            style={{ width: '100%' }}
            allowClear={isMultiple}
            mode={isMultiple ? 'multiple' : undefined}
            disabled={!Array.isArray(selector)}
          >
            {
              Array.isArray(selector) && selector.map(([key, text]) => (
                <Select.Option key={key} value={key}>
                  {text}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      );
    }
    case 'checkbox': {
      return (
        <Form.Item name={name} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      );
    }
    default: {
      console.error(`unknown edotir type ${type}`);
      return 'in develop';
    }
  }
};

export default CellEditor;
