import React from 'react';
import { inject, observer } from 'mobx-react';

import { TableHeader } from 'elements/headers';
import Card from 'elements/card';
import Table from 'elements/table';
import { FiltersButton } from 'elements/filters';
import Chart from 'elements/chart/primecostchart';
import DaterangeTitle from 'elements/chart/daterangeTitle';

import Summary from './summary';

import classes from './index.module.scss';

const Cleans = ({ table: { chart, filter } }) => (
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
      <Card>
        <DaterangeTitle announce="Период" range={filter.get('device_date')} />
        <Chart chart={chart} />
      </Card>
      <Summary />
      <Card className={classes.table}>
        <Table />
      </Card>
    </div>
  </>
);

export default inject('table')(observer(Cleans));
