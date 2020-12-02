import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Card as AntCard } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { TableHeader } from 'elements/headers';
import Card from 'elements/card';
import Table from 'elements/table';
import { FiltersButton } from 'elements/filters';
import Multycurve from 'elements/chart/multycurve';
import Loader from 'elements/loader';

import Summary from './summary';

import classes from './index.module.scss';

const Cleans = ({ table }) => {
  const { xSeria, series, isLoaded } = table;
  return (
    <>
      <TableHeader
        title="Расход чистящих средств"
        customButtons={(
          <>
            <Button disabled icon={<DownloadOutlined />}>Экспорт Excel</Button>
            <FiltersButton />
          </>
        )}
      />
      <div className={classes.root}>
        <AntCard>
          { !isLoaded && <div className={classes.chartloader}><Loader size="large" /></div> }
          { isLoaded && (
            <Multycurve
              height={380}
              x={xSeria}
              y={series}
              y1={{ text: 'Наливов в день', decimalsInFloat: 0 }}
              y2={{ text: 'Отмен в день', decimalsInFloat: 0 }}
            />
          )}
        </AntCard>
        <Summary />
        <Card className={classes.table}>
          <Table />
        </Card>
      </div>
    </>
  );
};

export default inject('table')(observer(Cleans));
