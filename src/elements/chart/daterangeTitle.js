import React from 'react';
import { SwapRightOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import { isDateRange } from 'utils/date';

import styles from './daterangeTitle.module.scss';

const DaterangeTitle = ({ announce, range, className }) => {
  if (!isDateRange(range)) {
    return <div className={className}>за все время</div>;
  }
  return (
    <div className={classnames(styles.whole, className)}>
      <div>{`${announce}:`}</div>
      <div>
        <span>{range[0].format('yyyy-MM-DD')}</span>
        <SwapRightOutlined />
        <span>{range[1].format('yyyy-MM-DD')}</span>
      </div>
    </div>
  );
};

export default DaterangeTitle;
