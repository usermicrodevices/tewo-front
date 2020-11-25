/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Collapse as AntCollapse } from 'antd';
import cx from 'classnames';

import styles from './styles.module.scss';

export function Collapse({ children, className, ...rest }) {
  return (
    <AntCollapse
      destroyInactivePanel
      expandIconPosition="right"
      bordered={false}
      className={cx([styles.container, className])}
      {...rest}
    >
      {children}
    </AntCollapse>
  );
}

Collapse.Panel = function CollasePanel({ children, ...rest }) {
  return (
    <AntCollapse.Panel {...rest}>
      {children}
    </AntCollapse.Panel>
  );
};

export function Row({
  children, className, style = {}, ...rest
}) {
  const customStyle = { ...style };

  return (
    <div style={customStyle} className={cx([styles.row, className])} {...rest}>
      {children}
    </div>
  );
}

export default Collapse;
