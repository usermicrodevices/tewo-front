import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';
import Loader from 'elements/loader';
import moment from 'moment';

const renderVoltageTooltip = ({ date, range }) => `
  <div style="padding: 4px 16px; font-size: 14px;">
    <div><span style="color: #454545">(${moment(date).format('DD.MM HH:mm')})</span><div/>
    <div><b>${range[0]} - ${range[1]}</b></div>
  </div>
`;

const COLOR = '#66C7F4';

const WaterChart = ({ size: { width }, element: { details } }) => {
  if (typeof details.waterSeries === 'undefined') {
    return (
      <Card>
        <Loader size="large" />
      </Card>
    );
  }

  const series = [{ data: details.waterSeries }];

  const options = {
    colors: COLOR,
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
  };

  return (
    <Card>
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

export default withSize()(inject('element')(observer(WaterChart)));
