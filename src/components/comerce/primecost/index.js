import React from 'react';
import { inject, observer } from 'mobx-react';
import { Space } from 'antd';

import { TableHeader } from 'elements/headers';
import Card from 'elements/card';
import Table from 'elements/table';
import { FiltersButton } from 'elements/filters';
import Chart from 'elements/chart/primecostchart';
import DaterangeTitle from 'elements/chart/daterangeTitle';
import Typography from 'elements/typography';

import Summary from './summary';

import classes from './index.module.scss';

const Primecost = ({ table: { chart, filter } }) => (
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
      <Card noMargin>
        <Space size={32}>
          <Typography.Title level={3}>Топ 6 напитков по прибыли</Typography.Title>
          <DaterangeTitle announce="Период" range={filter.get('device_date')} />
        </Space>
        <Chart chart={chart} />
      </Card>
      <Summary />
      <Card className={classes.table}>
        <Table />
      </Card>
    </div>
  </>
);

export default inject('table')(observer(Primecost));
