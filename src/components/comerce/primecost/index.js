import React from 'react';
import { inject, observer } from 'mobx-react';

import { TableHeader } from 'elements/headers';
import Card from 'elements/card';
import Table from 'elements/table';
import { FiltersButton } from 'elements/filters';

import Summary from './summary';
import Chart from './chart';

import classes from './index.module.scss';

const Cleans = ({ table }) => (
  <>
    <TableHeader
      title="Себестоимость"
      customButtons={(
        <>
          <FiltersButton />
        </>
        )}
    />
    <div className={classes.root}>
      <Chart />
      <Summary />
      <Card className={classes.table}>
        <Table />
      </Card>
    </div>
  </>
);

export default inject('table')(observer(Cleans));
