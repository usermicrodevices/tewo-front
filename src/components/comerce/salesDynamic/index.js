import React from 'react';
import { Card } from 'antd';

import Table from 'elements/table';
import Stats from './stats';
import Chart from './chart';

import classes from './index.module.scss';

const SalesDynamic = () => (
  <div className={classes.root}>
    <Chart />
    <Stats />
    <Card className={classes.table}>
      <Table />
    </Card>
  </div>
);

export default SalesDynamic;
