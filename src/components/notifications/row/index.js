import React from 'react';
import cx from 'classnames';

import styles from './style.module.scss';

function NotificationRow({ children, className, style = {} }) {
  const customStyle = { ...style };

  return (
    <div style={customStyle} className={cx([styles.container, className])}>
      {children}
    </div>
  );
}

export default NotificationRow;
