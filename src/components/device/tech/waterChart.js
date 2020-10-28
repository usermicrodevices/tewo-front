import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import Typography from 'elements/typography';

const COLORS = ['#228148'];

const WaterChart = ({ size, element: { details: { waterQuality, xaxis } } }) => {
  const series = [{
    name: 'Жесткость воды',
    type: 'line',
    data: waterQuality.map((v) => Math.round(v * 1000) / 1000),
  }];
  const data = {
    colors: COLORS,
    chart: {
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 4,
      curve: 'smooth',
    },
    xaxis: {
      categories: xaxis,
    },
    yaxis: {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: 'black',
      },
      labels: {
        style: {
          color: 'black',
        },
        step: 0.1,
        formatter: (v) => Math.round(v * 1000) / 1000,
      },
      min: 0,
      max: 1,
    },
  };
  return (
    <Card>
      <Typography.Title level={3}>Жесткость воды</Typography.Title>
      <Chart
        series={series}
        width={size.width - 55}
        height={400}
        options={data}
      />
    </Card>
  );
};

export default withSize()(inject('element')(observer(WaterChart)));
