import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';

import style from './style.module.scss';

const Loader = ({ fullscreen, size, className }) => {
  const classes = classNames(style.loader, { [style.fillscreen]: fullscreen }, className);
  const finalSize = size || fullscreen ? 'large' : 'default';
  return <Spin className={classes} size={finalSize} />;
};

export default Loader;
