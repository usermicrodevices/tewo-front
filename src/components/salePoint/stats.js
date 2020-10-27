import React from 'react';
import { Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Format from 'elements/format';
import Typography from 'elements/typography';
import Loader from 'elements/loader';
import { humanizeSeconds } from 'utils/date';

import style from './stats.module.scss';

const Stats = ({ element: { details } }) => {
  const {
    devicesServceRequiredAmount,
    devicesHardWaterAmount,
    devicesAmount,
    downtime,
    outdatedTasksAmount,
    offDevicesAmount,
  } = details;
  const isLoaded = typeof devicesServceRequiredAmount === 'number';
  return (
    <Card className={style.root}>
      <Typography.Title level={3}>
        <Icon name="bar-chart-outline" className={style.icon} />
        Общая статистика
      </Typography.Title>
      <div className={style.groups}>
        <Typography.Link to="/"><Format width={170}>Группа цен 1</Format></Typography.Link>
        <Typography.Link to="/"><Format width={170}>Группа цен цен цен цен цен 1</Format></Typography.Link>
      </div>
      <div className={style.outdatedtasks}>
        <Typography.Value size="xl" strong><Format>{ outdatedTasksAmount }</Format></Typography.Value>
        <Typography.Caption>проссроченные задачи за 24 часа</Typography.Caption>
      </div>
      <Divider />
      <div className={style.equipment}>
        <Typography.Value size="xl" strong><Format>{ devicesAmount }</Format></Typography.Value>
        <Typography.Caption>всего оборудования на объекте</Typography.Caption>
      </div>
      <div className={style.conditions}>
        <Typography.Caption>Состояние оборудования</Typography.Caption>
        <div className={style.state}>
          <Typography.Value className={style.value} size="l" strong>
            {typeof offDevicesAmount === 'number' ? offDevicesAmount : <Loader size="small" />}
          </Typography.Value>
          <Typography.Caption>не работает</Typography.Caption>
        </div>
        <div className={classNames(style.state, style.danger)}>
          <Typography.Value className={style.value} size="l" strong>{isLoaded ? devicesServceRequiredAmount : <Loader size="small" />}</Typography.Value>
          <Typography.Caption>нужен сервис</Typography.Caption>
        </div>
        <div className={style.state}>
          <Typography.Value className={style.value} size="l" strong>{isLoaded ? devicesHardWaterAmount : <Loader size="small" />}</Typography.Value>
          <Typography.Caption>жесткая вода</Typography.Caption>
        </div>
      </div>
      <div className={classNames(style.sublabel, style.downtime)}>
        <Typography.Caption>Время простоя</Typography.Caption>
        <Typography.Value strong><Format width={180}>{humanizeSeconds(downtime)}</Format></Typography.Value>
      </div>
    </Card>
  );
};

export default inject('element')(observer(Stats));
