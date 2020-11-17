import React from 'react';
import cx from 'classnames';

import styles from './style.module.scss';

function NotificationRow({
  children, className, style = {}, ...rest
}) {
  const customStyle = { ...style };

  return (
    <div style={customStyle} className={cx([styles.container, className])} {...rest}>
      {children}
    </div>
  );
}

export default NotificationRow;
