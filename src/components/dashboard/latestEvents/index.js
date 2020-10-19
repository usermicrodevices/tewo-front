import React from 'react';
import moment from 'moment';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Badge from 'elements/salePointBadge';

import tableWidget from '../tableWidget';

import classes from './index.module.scss';

const FavoriteObjects = tableWidget([
  {
    title: 'Название объекта',
    dataIndex: 'salePoint',
    render: (salePoint) => (
      salePoint ? <Badge stateColor={salePoint.stateColor}><Format>{salePoint.name}</Format></Badge> : <Loader />
    ),
  },
  {
    title: 'Событие',
    dataIndex: 'eventName',
    render: (v) => <Format>{v}</Format>,
  },
  {
    title: 'Дата события и длительность',
    dataIndex: 'timeInfo',
    render: ({ openDate, closeDate }) => (
      <div>
        <div className={classes.date}>{openDate.format('d MMMM, hh:mm')}</div>
        <div className={classes.duration}>{closeDate.isValid() ? moment.duration(closeDate - openDate).humanize() : 'не завершено'}</div>
      </div>
    ),
  },
]);

export default FavoriteObjects;
