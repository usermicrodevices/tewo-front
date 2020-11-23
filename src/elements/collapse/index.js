/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Collapse as AntCollapse } from 'antd';

import styles from './styles.module.scss';

export function Collapse({ children, ...rest }) {
  return (
    <AntCollapse
      destroyInactivePanel
      expandIconPosition="right"
      bordered={false}
      className={styles.table}
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

export default Collapse;
