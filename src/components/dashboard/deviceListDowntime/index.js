import React from 'react';
import { Typography, Dropdown, Menu } from 'antd';
import moment from 'moment';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Badge from 'elements/badged';
import Icon from 'elements/icon';
import { salePoints as salePointsRout } from 'routes';

import { tableItemLink } from 'elements/table/trickyCells';
import { formatDuration } from 'utils/date';

import tableWidget from '../tableWidget';
import classes from './index.module.scss';

const { Title, Text } = Typography;

const overlay = (details) => (
  <Menu>
    { details.map(({ eventTypeName, eventTypeId, value }) => (
      <div className={classes.row} key={eventTypeId}>
        <div className={classes.label}><Text><Format>{eventTypeName}</Format></Text></div>
        <div className={classes.text}><Text><Format>{formatDuration(moment.duration(value, 'millisecond'))}</Format></Text></div>
      </div>
    ))}
  </Menu>
);

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'name',
    render: (name, { id }) => (
      name
        ? <Badge size={8}><Title level={4}>{ tableItemLink(name, `${salePointsRout.path}/${id}`, 450) }</Title></Badge>
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
        <Text>
          <Format>
            {formatDuration(moment.duration(v.sum, 'millisecond'))}
          </Format>
        </Text>
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
