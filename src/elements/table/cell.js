import React from 'react';
import { Tooltip } from 'antd';

import Loader from 'elements/loader';

const FORMAT = new Intl.NumberFormat('ru-RU');

const Cell = ({
  style, className, children, width,
}) => {
  const Div = ({ children: c }) => <div style={style} className={className}>{c}</div>;
  if (typeof children === 'undefined') {
    return <Div><Loader /></Div>;
  }
  if (children === null) {
    return <Div>—</Div>;
  }
  if (typeof children === 'object') {
    return <Div>{children}</Div>;
  }
  let txt;
  if (typeof children === 'string') {
    txt = children;
  } else if (typeof children === 'number') {
    txt = FORMAT.format(children);
  } else {
    console.error('unknown cell data', children);
    txt = `${children}`;
  }
  const symbolsLimit = Math.floor(width / 12);
  if (txt.length <= symbolsLimit) {
    return <Div>{txt}</Div>;
  }
  return <Div><Tooltip title={txt}>{`${txt.slice(0, symbolsLimit - 2).trim()}…`}</Tooltip></Div>;
};

export default Cell;
