/* eslint class-methods-use-this: "off" */
import React from 'react';
import Table from 'models/table';
import getBeverages from 'services/beverage';
import TimeAgo from 'react-timeago';
import rusStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(rusStrings);

const COLUMNS = {
  id: {
    bydefault: true,
    title: 'ID',
    width: 70,
  },
  created_date: {
    bydefault: true,
    title: 'Момент налива',
    grow: 1,
    sortDirections: 'descend',
    sortDefault: true,
    transform: (data) => data && <TimeAgo date={data} formatter={formatter} />,
  },
  cid: {
    bydefault: true,
    title: 'Код',
    align: 'right',
    width: 70,
  },
  device: {
    bydefault: true,
    title: 'Устройство',
    align: 'right',
    width: 100,
  },
};

class Beverages extends Table {
  constructor() {
    super(getBeverages, COLUMNS);
  }

  toString() {
    return 'Beverages';
  }
}

export default Beverages;
