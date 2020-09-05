import React from 'react';
import {
  Tooltip, Dropdown, Button, Space,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { Map as YandexMap, Placemark } from 'react-yandex-maps';

import Loader from 'elements/loader';
import { isColor } from 'utils/color';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import style from './style.module.scss';

const FORMAT = new Intl.NumberFormat('ru-RU');

const Color = ({ children }) => (
  <>
    <div className={style.color} style={{ backgroundColor: children }} />
    {children}
  </>
);

const LOCATION_SEPARATOR = ', ';

const tryParseLocation = (txt) => {
  const coordinates = txt.split(LOCATION_SEPARATOR).map(parseFloat);
  if (coordinates.length !== 2) {
    return null;
  }
  // тут аккуратно. Написано с учетом nan в качестве значения
  if (Math.abs(coordinates[0]) <= 90 && Math.abs(coordinates[1]) <= 180) {
    return coordinates;
  }
  return null;
};

const Location = ({ location }) => (
  <Dropdown
    overlay={() => (
      <div>
        <YandexMap
          defaultState={{ center: location, zoom: 12 }}
        >
          <Placemark geometry={location} />
        </YandexMap>
      </div>
    )}
  >
    <Space>
      <span>{location.map((v) => Math.round(v * 100) / 100).join(LOCATION_SEPARATOR)}</span>
      <CopyToClipboard text={location.join(LOCATION_SEPARATOR)}>
        <Button type="text" icon={<CopyOutlined />} />
      </CopyToClipboard>
    </Space>
  </Dropdown>
);

const Format = ({
  children, width,
}) => {
  if (typeof children === 'undefined') {
    return <Loader />;
  }
  if (children === null) {
    return '—';
  }
  let txt;
  if (typeof children === 'string') {
    if (isColor(children)) {
      return <Color>{children}</Color>;
    }
    const location = tryParseLocation(children);
    if (location !== null) {
      return <Location location={location} />;
    }
    txt = children;
  } else if (typeof children === 'number') {
    txt = FORMAT.format(children);
  } else if (typeof children === 'boolean') {
    return children ? 'Да' : 'Нет';
  } else {
    console.error('unknown cell data', children);
    txt = `${children}`;
  }
  const symbolsLimit = Math.floor(width ? width / 12 : 300);
  if (txt.length <= symbolsLimit) {
    return txt;
  }
  return <Tooltip title={txt}>{`${txt.slice(0, symbolsLimit - 2).trim()}…`}</Tooltip>;
};

export default Format;
