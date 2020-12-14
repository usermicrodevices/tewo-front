import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Card as AntCard } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import SummaryCard from 'elements/card/summary';
import { TableHeader } from 'elements/headers';
import Card from 'elements/card';
import Table from 'elements/table';
import { FiltersButton } from 'elements/filters';
import Format from 'elements/format';
import Typography from 'elements/typography';
import Loader from 'elements/loader';
import Multycurve from 'elements/chart/multycurve';

import classes from './index.module.scss';

const Cleans = ({ table }) => {
  const { cleans } = table;
  let { detergent } = table.stats;
  const { tablets } = table.stats;
  let ext = 'мл';
  if (detergent > 1e5) {
    ext = 'л';
    detergent /= 1e3;
  }
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
          { typeof cleans !== 'undefined' && cleans.x !== 'undefined'
            ? (
              <Multycurve
                height={384}
                x={cleans.x}
                y={[
                  {
                    name: 'Наливы',
                    data: cleans.beverages,
                    type: 'line',
                    axis: 2,
                    width: 4,
                  },
                  {
                    name: 'Фактическое число очисток',
                    data: cleans.actual,
                    type: 'column',
                    axis: 1,
                    width: 1,
                  },
                  {
                    name: 'Ожидаемое число очисток',
                    data: cleans.expected,
                    type: 'column',
                    axis: 1,
                    width: 1,
                  },
                ]}
                y1={{ text: 'Наливов в день', decimalsInFloat: 0 }}
                y2={{ text: 'Очисток в день', decimalsInFloat: 0 }}
              />
            )
            : <Loader size="large" /> }
        </AntCard>
        <SummaryCard align="middle">
          <div>
            <Typography.Value size="xxl"><Format>{ tablets }</Format></Typography.Value>
            <Typography.Caption>количество таблеток за период</Typography.Caption>
          </div>
          <div>
            <div>
              <Typography.Value size="xxl"><Format>{ detergent }</Format></Typography.Value>
              { typeof detergent === 'number' && <Typography.Caption>{ext}</Typography.Caption> }
            </div>
            <Typography.Caption>количество жидкости за период</Typography.Caption>
          </div>
          <div>
            <Typography.Value size="xxl"><Format>{ cleans?.actualSum }</Format></Typography.Value>
            <Typography.Caption>фактическое количество очисток</Typography.Caption>
          </div>
          <div>
            <Typography.Value size="xxl"><Format>{ cleans?.expectedSum }</Format></Typography.Value>
            <Typography.Caption>ожидаемое количество очисток</Typography.Caption>
          </div>
        </SummaryCard>
        <Card className={classes.table}>
          <Table />
        </Card>
      </div>
    </>
  );
};

export default inject('table')(observer(Cleans));
