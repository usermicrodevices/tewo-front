import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import Format from 'elements/format';

const linkedCell = (onClick) => (name, datum, width) => (
  <Button className="cell-link" onClick={onClick(datum)} type="link"><Format width={width}>{ name }</Format></Button>
);

const tableItemLink = (text, to, width) => <Link to={to}><Format width={width}>{text}</Format></Link>;

export { tableItemLink, linkedCell };
