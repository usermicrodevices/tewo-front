import React from 'react';
import { Card } from 'antd';
import Table from 'elements/table';

import classes from './index.module.scss';

const SalesDynamic = () => (
  <div className={classes.root}>
    <Card>chart</Card>
    <Card className={classes.details}>details</Card>
    <Card className={classes.table}>
      <Table />
    </Card>
  </div>
);

export default SalesDynamic;
