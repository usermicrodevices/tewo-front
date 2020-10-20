import React from 'react';
import { Typography, Dropdown, Menu } from 'antd';
import moment from 'moment';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Badge from 'elements/salePointBadge';

import Icon from 'elements/icon';

import tableWidget from '../tableWidget';
import classes from './index.module.scss';

const { Title, Text } = Typography;

const overlay = (details) => (
  <Menu>
    { details.map(({ eventTypeName, eventTypeId, value }) => (
      <div className={classes.row} key={eventTypeId}>
        <div><Text><Format>{eventTypeName}</Format></Text></div>
        <div><Text><Format>{moment.duration(value, 'millisecond').humanize()}</Format></Text></div>
      </div>
    ))}
  </Menu>
);

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'name',
    render: (name) => (
      name
        ? <Badge><Title level={4}>{name}</Title></Badge>
        : <Loader />
    ),
  },
  {
    title: 'Длительность простоя',
    dataIndex: 'value',
    render: (v) => <Format><Text>{moment.duration(v, 'millisecond').humanize()}</Text></Format>,
  },
  {
    title: '',
    dataIndex: 'details',
    render: (v) => (
      <Dropdown
        overlay={overlay(v)}
        placement="topRight"
      >
        <div><Icon size={20} name="alert-circle-outline" /></div>
      </Dropdown>
    ),
  },
]);

export default FavoriteObjects;
