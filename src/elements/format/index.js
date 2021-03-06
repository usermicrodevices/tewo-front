import React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import { isColor } from 'utils/color';

import { Location, tryParseLocation } from './location';
import style from './style.module.scss';

const FORMAT = new Intl.NumberFormat('ru-RU');

const Color = ({ children }) => (
  <>
    <div className={style.color} style={{ backgroundColor: children }} />
    {children}
  </>
);

const Format = ({
  children, width, isCost,
}) => {
  if (typeof children === 'undefined') {
    return <Loader />;
  }
  if (children === null) {
    return '—';
  }
  if (React.isValidElement(children)) {
    return children;
  }
  if (typeof children === 'boolean') {
    return children ? 'Да' : 'Нет';
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
    txt = FORMAT.format(children.toFixed(2));
    if (isCost) {
      txt = `${txt}₽`;
    }
  } else if (moment.isMoment(children)) {
    return (
      <div className={style.clock}>
        <div>
          <Icon size={16} name="clock-outline" className={style.clockicon} />
          <Format>{ children.isValid() ? children.format('DD.MM.YY HH:mm') : null }</Format>
        </div>
      </div>
    );
  } else if (Array.isArray(children) && children.length === 2 && typeof children.find((v) => typeof v !== 'number') === 'undefined') {
    return <Location location={children} />;
  } else if (Array.isArray(children)) {
    txt = children.join(', ');
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

export { Format as default, FORMAT };
