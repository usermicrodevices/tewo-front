import React from 'react';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Typography from 'elements/typography';

import styles from './index.module.scss';

const ChangesLabel = ({ value }) => {
  if (typeof value !== 'number') {
    return <div className={styles.growth}><Loader /></div>;
  }
  if (value === 0) {
    return null;
  }
  return (
    <Typography.Value size="l" className={styles.growth}>
      <Icon name={value > 0 ? 'arrow-upward-outline' : 'arrow-downward-outline'} className={value > 0 ? styles.rise : styles.fail} />
      {`${Math.round(Math.abs(value))}%`}
    </Typography.Value >
  );
};

export default ChangesLabel;
