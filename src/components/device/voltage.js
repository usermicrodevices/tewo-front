/* eslint no-param-reassign: off */
import React from 'react';
import { Card } from 'antd';
import { inject, observer } from 'mobx-react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import DatergangePicker from 'elements/filters/daterangepicker';
import Loader from 'elements/loader';
import locale from 'elements/chart/locale';

import classes from './voltage.module.scss';

const Commerce = ({ element: { details }, size: { width } }) => {
  if (typeof details.voltage === 'undefined') {
    return (
      <Card className={classes.root}>
        <DatergangePicker title="Период" value={details.imputsManager.dateRange} onChange={(v) => { details.imputsManager.dateRange = v; }} />
        <Loader size="large" />
      </Card>
    );
  }
  const minPower = 220;
  const maxPower = 240;
  const dates = details.voltageXSeria;

  const colors = ['rgb(146,104,62)', 'red', 'red'];
  const l1Data = details.voltage.map(({ voltage }) => voltage);

  const series = [
    {
      name: 'Напряжение',
      type: 'line',
      data: l1Data,
    },
    {
      name: `Мин. (${minPower})`,
      type: 'line',
      data: new Array(l1Data.length).fill(minPower),
    },
    {
      name: `Макс. (${maxPower})`,
      type: 'line',
      data: new Array(l1Data.length).fill(maxPower),
    },
  ];

  const getHigerCords = (data) => data.map((v, i) => ({ x: i + 1, y: v })).filter((d) => d.y > maxPower);

  const getLowerCords = (data) => data.map((v, i) => ({ x: i + 1, y: v })).filter((d) => d.y < minPower);

  const higherPoints = getHigerCords(l1Data);
  const lowerPoints = getLowerCords(l1Data);

  const options = {
    series,
    colors,
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      ...locale,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: 'straight',
      dashArray: [0, 0, 0, 4, 4],
    },
    title: {
      align: 'left',
    },
    annotations: {
      points: [...higherPoints, ...lowerPoints].map((h) => ({
        x: h.x,
        y: h.y,
        marker: {
          size: 3,
          fillColor: 'red',
          strokeColor: 'red',
          radius: 2,
        },
      })),
    },
    xaxis: {
      categories: dates.map((d) => d.format('D MMM HH:mm')),
    },
    yaxis: [
      {
        seriesName: 'Напряжение',
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
        },
        title: {
          style: {
            color: 'black',
          },
        },
        decimalsInFloat: 2,
        tooltip: {
          enabled: true,
        },
      },
    ],
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  return (
    <Card className={classes.root}>
      <DatergangePicker title="Период" value={details.imputsManager.dateRange} onChange={(v) => { details.imputsManager.dateRange = v; }} />
      <Chart
        series={series}
        width={width - 55}
        height={555}
        options={options}
      />
    </Card>
  );
};

export default withSize()(inject('element')(observer(Commerce)));
