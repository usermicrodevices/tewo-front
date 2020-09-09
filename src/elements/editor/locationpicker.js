import React from 'react';
import {
  Form, Dropdown, Input, Space,
} from 'antd';
import { Map as YandexMap, Placemark } from 'react-yandex-maps';
import Icon from 'elements/icon';

import style from './style.module.scss';

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

const LocationPicker = ({ getFieldValue, setFieldsValue, name }) => {
  const val = getFieldValue(name);
  const overlay = () => (
    <MapLocationPicker
      location={val || '55.7532, 37.6225'}
      setValue={(pos) => setFieldsValue({ [name]: pos })}
    />
  );
  // Так и не понял почему, но пока не добавишь Form.Item значение не попадает в submit
  return (
    <div className={style.location}>
      <Form.Item noStyle name={name}><Input /></Form.Item>
      <Dropdown overlay={overlay} placement="bottomRight">
        <Space>
          <Icon name="pin-outline" />
          <span>Выбрать на карте</span>
        </Space>
      </Dropdown>
    </div>
  );
};

export default LocationPicker;
