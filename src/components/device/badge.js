import React from 'react';
import classnames from 'classnames';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Format from 'elements/format';
import Typography from 'elements/typography';

import style from './badge.module.scss';

const Badge = ({
  value, subvalue, label, growth, action,
}) => {
  const isLoading = typeof value === 'undefined' && typeof subvalue === 'undefined' && typeof growth === 'undefined';
  return (
    // eslint-disable-next-line
    <div onClick={action} className={classnames(style.badge, { [style.actable]: !!action })}>
      <div className={style.head}>
        { typeof growth === 'number' && growth !== 0 && (
          <Icon name={growth > 0 ? 'arrow-upward-outline' : 'arrow-downward-outline'} className={growth > 0 ? style.rise : style.fail} />
        )}
        <div className={style.value}>
          { isLoading ? <Loader /> : (
            <>
              { typeof value !== 'undefined' && <Typography.Value strong><Format>{ value }</Format></Typography.Value>}
              { subvalue && <span className={style.subvalue}><Format>{subvalue}</Format></span> }
            </>
          )}
        </div>
      </div>
      <Typography.Caption>{ label }</Typography.Caption>
    </div>
  );
};

export default Badge;
