import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card as AntCard } from 'antd';

import { TableHeader } from 'elements/headers';
import Card from 'elements/card';
import Table from 'elements/table';
import { FiltersButton } from 'elements/filters';
import Multycurve from 'elements/chart/multycurve';
import Loader from 'elements/loader';
import DaterangeTitle from 'elements/chart/daterangeTitle';
import Typography from 'elements/typography';

import Summary from './summary';

import classes from './index.module.scss';

const Cleans = ({ table }) => {
  const { xSeria, series, isLoaded } = table;
  return (
    <>
      <TableHeader
        title="Отмена напитков"
        customButtons={(
          <>
            <FiltersButton />
          </>
        )}
      />
      <div className={classes.root}>
        <AntCard>
          { !isLoaded && <div className={classes.chartloader}><Loader size="large" /></div> }
          { isLoaded && (
            <div>
              <DaterangeTitle announce="Период" range={table.filter.get('device_date')} />
              <Multycurve
                height={362}
                x={xSeria}
                y={series}
                y1={{ text: 'Наливов в день', decimalsInFloat: 0 }}
                y2={{ text: 'Отмен в день', decimalsInFloat: 0 }}
              />
            </div>
          )}
        </AntCard>
        <Summary />
        <Card className={classes.table}>
          <Typography.Title level={3}>Список отмененных напитков</Typography.Title>
          <Table />
        </Card>
      </div>
    </>
  );
};

export default inject('table')(observer(Cleans));
