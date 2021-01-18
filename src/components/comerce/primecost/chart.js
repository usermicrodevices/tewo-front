import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Space } from 'antd';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';
import DaterangeTitle from 'elements/chart/daterangeTitle';
import locale from 'elements/chart/locale';
import Loader from 'elements/loader';
import { FORMAT } from 'elements/format';
import Typography from 'elements/typography';

const PrimecostChart = inject('table')(observer(({
  size, table,
}) => {
  if (typeof table.chart === 'undefined') {
    return <Loader size="large" />;
  }
  const { categories, series } = table.chart;
  if (categories.length === 0) {
    return <NoData noMargin title="Недостаточно данных для построения графика" />;
  }

  const sums = [];
  for (const { data } of Object.values(series)) {
    while (sums.length < data.length) {
      sums.push(0);
    }
    for (const [id, v] of data.entries()) {
      sums[id] += v;
    }
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.round(data[i]);
    }
  }
  const max = Math.max(...sums);

  const formatter = (v) => FORMAT.format(v.toFixed(0));

  const data = {
    colors,
    chart: {
      height: size.height,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      ...locale,
    },

    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v) => {
        if (v < max / 12) {
          return '';
        }
        return formatter(v);
      },
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories,
      labels: { formatter },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };
  return (
    <Chart
      type="bar"
      series={series}
      width={size.width}
      height={data.chart.height}
      options={data}
    />
  );
}));

const Wrap = withSize()(inject('table')(observer(({
  size: { width }, table,
}) => (
  <Card>
    <Space size={32}>
      <Typography.Title level={3}>Топ 6 напитков по прибыли</Typography.Title>
      <DaterangeTitle announce="Период" range={table.filter.get('device_date')} />
    </Space>
    <PrimecostChart size={{ width: width - 50, height: 403 }} />
  </Card>
))));

export default Wrap;
