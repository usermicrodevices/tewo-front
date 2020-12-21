/* eslint no-param-reassign: off */
import React from 'react';
import { Card } from 'antd';
import { inject, observer } from 'mobx-react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import DatergangePicker from 'elements/filters/daterangepicker';
import Loader from 'elements/loader';

import classes from './voltage.module.scss';

const renderVoltageTooltip = ({ name, date, range }) => `
  <div style="padding: 4px 16px; font-size: 14px;">
    <div>${name} <span style="color: #454545">(${moment(date).format('DD.MM HH:mm')})</span><div/>
    <div><b>${range[0]} - ${range[1]} В.</b></div>
  </div>
`;

const COLOR_L1 = 'rgb(146,104,62)';
const COLOR_L2 = '#000000';
const COLOR_L3 = 'rgb(166,166,166)';
const COLOR_NORMAL_HIGH = 'rgba(0, 0, 200, 0.4)';
const COLOR_NORMAL_LOW = 'rgba(200,0,0,0.4)';

const LOW_VALUE = 220;
const HIGH_VALUE = 240;

const Voltage = ({ element: { details }, size: { width } }) => {
  if (typeof details.voltage === 'undefined') {
    return (
      <Card className={classes.root}>
        <DatergangePicker title="Период" value={details.imputsManager.dateRange} onChange={(v) => { details.imputsManager.dateRange = v; }} />
        <Loader size="large" />
      </Card>
    );
  }

  const colors = [COLOR_L1, COLOR_L2, COLOR_L3];
  const series = details.voltageSeries;

  const options = {
    colors,
    chart: {
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
      selection: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    },
    tooltip: {
      custom: ({
        seriesIndex, y1, y2, w, dataPointIndex,
      }) => {
        const { name } = w.config.series[seriesIndex];
        const date = w.config.series[seriesIndex].data[dataPointIndex].x;
        return renderVoltageTooltip({
          name,
          date,
          range: [y1, y2],
        });
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      title: {
        text: 'Напряжение, В',
      },
    },
    annotations: {
      yaxis: [{
        y: LOW_VALUE,
        borderColor: COLOR_NORMAL_HIGH,
        strokeDashArray: 7,
      }, {
        y: HIGH_VALUE,
        borderColor: COLOR_NORMAL_LOW,
        strokeDashArray: 7,
      }],
    },
  };

  return (
    <Card className={classes.root}>
      <DatergangePicker title="Период" value={details.imputsManager.dateRange} onChange={(v) => { details.imputsManager.dateRange = v; }} />
      <Chart
        series={series}
        width={width - 55}
        height={555}
        type="rangeBar"
        options={options}
      />
    </Card>
  );
};

export default withSize()(inject('element')(observer(Voltage)));
