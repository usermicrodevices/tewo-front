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
    sorter: (a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name) || a.key - b.key;
      }
      return a.key - b.key;
    },
  },
  {
    title: 'Длительность простоя',
    dataIndex: 'value',
    render: (v) => (
      <div className={classes.split}>
        <Text><Format>{moment.duration(v.sum, 'millisecond').humanize()}</Format></Text>
        <Dropdown
          overlay={overlay(v.details)}
          placement="topRight"
        >
          <div><Icon size={20} name="alert-circle-outline" /></div>
        </Dropdown>
      </div>
    ),
    sorter: (a, b) => a.value.sum - b.value.sum || a.key - b.key,
  },
]);

export default FavoriteObjects;
