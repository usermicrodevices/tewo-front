import React from 'react';
import { Link } from 'react-router-dom';

import Format from 'elements/format';

const tableItemLink = (text, to, width) => <Link to={to}><Format width={width}>{text}</Format></Link>;

export default tableItemLink;
