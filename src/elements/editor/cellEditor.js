import React from 'react';
import {
  Input, Form, Select, InputNumber,
} from 'antd';
import LocationPicker from './locationpicker';

import ColorPicker from './colorpicker';

const CellEditor = ({ editor: { type, selector }, name }) => {
  switch (type) {
    case 'text': {
      return (
        <Form.Item name={name}>
          <Input />
        </Form.Item>
      );
    }
    case 'email': {
      return (
        <Form.Item name={name} rules={[{ type: 'email' }]}>
          <Input />
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
    case 'selector': {
      return (
        <Form.Item name={name}>
          <Select
            placeholder="Значение не задано"
            style={{ width: '100%' }}
          >
            {
              selector.map(([key, text]) => (
                <Select.Option key={key} value={key}>
                  {text}
                </Select.Option>
              ))
            }
          </Select>
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
