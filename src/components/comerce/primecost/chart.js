import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';
import DaterangeTitle from 'elements/chart/daterangeTitle';
import locale from 'elements/chart/locale';
import Loader from 'elements/loader';

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
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories,
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
    <DaterangeTitle announce="Период" range={table.filter.get('device_date')} />
    <PrimecostChart size={{ width: width - 50, height: 403 }} />
  </Card>
))));

export default Wrap;
