import React from 'react';
import classnames from 'classnames';

import Icon from 'elements/icon';
import Loader from 'elements/loader';

import style from './badge.module.scss';

const Badge = ({
  value, subvalue, label, growth, action,
}) => {
  const isLoading = typeof value === 'undefined' && typeof subvalue === 'undefined';
  return (
    <div onClick={action} className={classnames(style.badge, { [style.actable]: !!action })}>
      <div className={style.head}>
        { growth && <Icon name={growth > 0 ? 'arrow-upward-outline' : 'arrow-downward-outline'} className={growth > 0 ? style.rise : style.fail} /> }
        <div>
          { isLoading ? <Loader /> : (
            <>
              { value }
              { subvalue && <span className={style.subvalue}>{subvalue}</span> }
            </>
          )}
        </div>
      </div>
      <div className={style.label}>{ label }</div>
    </div>
  );
};

export default Badge;
