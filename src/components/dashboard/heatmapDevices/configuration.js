import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Typography from 'elements/typography';

import classnames from './index.module.scss';

export const getItemFromChartEvent = ({
  series, seriesIndex, dataPointIndex, w,
}) => w.config.series[seriesIndex].data[dataPointIndex];

export const Tooltip = ({ name, value }) => (
  <div className={classnames.tooltip}>
    <Typography.Text>
      {name}
      :
      {' '}
      {value}
    </Typography.Text>
  </div>
);

export const createTooltip = ({ onChange, chartData }) => (chartEvent) => {
  const item = getItemFromChartEvent(chartEvent);
  const value = item.y;

  return ReactDOMServer.renderToString(<Tooltip name={item.name} value={value} />);
};
