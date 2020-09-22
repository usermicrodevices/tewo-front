import React from 'react';
import classnames from 'classnames';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Format from 'elements/format';

import style from './badge.module.scss';

const Badge = ({
  value, subvalue, label, growth, action,
}) => {
  const isLoading = typeof value === 'undefined' && typeof subvalue === 'undefined' && typeof growth === 'undefined';
  return (
    <div onClick={action} className={classnames(style.badge, { [style.actable]: !!action })}>
      <div className={style.head}>
        { typeof growth === 'number' && growth !== 0 && <Icon name={growth > 0 ? 'arrow-upward-outline' : 'arrow-downward-outline'} className={growth > 0 ? style.rise : style.fail} /> }
        <div>
          { isLoading ? <Loader /> : (
            <>
              { typeof value !== 'undefined' && <Format>{ value }</Format>}
              { subvalue && <span className={style.subvalue}><Format>{subvalue}</Format></span> }
            </>
          )}
        </div>
      </div>
      <div className={style.label}>{ label }</div>
    </div>
  );
};

export default Badge;
