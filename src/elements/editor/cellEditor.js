import React from 'react';
import {
  Input, Form, Select, Dropdown,
} from 'antd';
import { Map as YandexMap, Placemark } from 'react-yandex-maps';

const MapLocationPicker = ({ location, setValue }) => {
  const center = location.split(',').map(parseFloat);
  const round = (v) => Math.round(v * 1e5) / 1e5;
  return (
    <div>
      <YandexMap
        defaultState={{ center, zoom: 12 }}
        instanceRef={(inst) => {
          if (inst === null) {
            return;
          }
          inst.events.add(['boundschange'], (e) => {
            setValue(e.originalEvent.newCenter.map(round).join(', '));
          });
        }}
      >
        <Placemark geometry={center} />
      </YandexMap>
    </div>
  );
};

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
          {({ getFieldValue, setFieldsValue }) => {
            const val = getFieldValue(name);
            const overlay = () => (
              <MapLocationPicker
                location={val}
                setValue={(pos) => setFieldsValue({ [name]: pos })}
              />
            );
            // Так и не понял почему, но пока не добавишь Form.Item в submit значение не попадает
            return (
              <>
                <Form.Item noStyle name={name}><Input style={{ display: 'none' }} /></Form.Item>
                <Dropdown overlay={overlay} placement="bottomRight">
                  <p>{val}</p>
                </Dropdown>
              </>
            );
          }}
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
