import React from 'react';
import { Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Format from 'elements/format';
import Loader from 'elements/loader';

import style from './stats.module.scss';

const Stats = () => {
  const isLoaded = false;
  return (
    <Card className={style.root}>
      <div className={style.title}>
        <Icon name="bar-chart-outline" className={style.icon} />
        Общая статистика
      </div>
      <div className={style.groups}>
        <Link><Format width={170}>Группа цен 1</Format></Link>
        <Link><Format width={170}>Группа цен цен цен цен цен 1</Format></Link>
      </div>
      <div className={style.outdatedtasks}>
        <div className={style.value}>{isLoaded ? 5 : <Loader />}</div>
        <div className={style.sublabel}>проссроченные задачи за 24 часа</div>
      </div>
      <Divider />
      <div className={style.equipment}>
        <div className={style.value}>{!isLoaded ? 240 : <Loader />}</div>
        <div className={style.sublabel}>всего оборудования на объекте</div>
      </div>
      <div className={style.conditions}>
        <div className={style.sublabel}>Состояние оборудования</div>
        <div className={style.state}>
          <div className={style.value}>{isLoaded ? 18 : <Loader size="small" />}</div>
          <div className={style.sublabel}>не работает</div>
        </div>
        <div className={classNames(style.state, style.danger)}>
          <div className={style.value}>{isLoaded ? 2 : <Loader size="small" />}</div>
          <div className={style.sublabel}>нужен сервис</div>
        </div>
        <div className={style.state}>
          <div className={style.value}>{!isLoaded ? 322 : <Loader size="small" />}</div>
          <div className={style.sublabel}>жесткая вода</div>
        </div>
      </div>
      <div className={classNames(style.sublabel, style.downtime)}>
        <div className={style.label}>Время простоя</div>
        <div><Format width={180}>1д 3ч 23мин</Format></div>
      </div>
    </Card>
  );
};

export default inject('element')(observer(Stats));
