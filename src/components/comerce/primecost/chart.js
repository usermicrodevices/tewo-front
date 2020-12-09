import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';

import locale from 'elements/chart/locale';
import style from 'elements/chart/style.module.scss';

const PrimecostChart = inject('table')(observer(({
  size, table,
}) => {
  if (!table.isLoaded) {
    return <NoData noMargin title="Недостаточно данных для построения графика" />;
  }
  const { categories, series } = table.chart;

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

const Wrap = withSize()(({
  size: { width },
}) => (
  <Card>
    <div className={style.chartwrap}><PrimecostChart size={{ width: width - 50, height: 421 }} /></div>
  </Card>
));

export default inject('table')(observer(Wrap));
