import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';

import Heatmap from 'elements/chart/heatmap/index';
import Loader from 'elements/loader';
import DeviceInfoModal from './deviceInfoModal';

import { createTooltip, legend, getItemFromChartEvent } from './utils';
import classnames from './index.module.scss';

const Chart = inject('storage')(observer(({ storage }) => {
  const {
    isLoaded, chartData, isSelectedVisible, setSelected, selectedDevice,
  } = storage;
  const tooltip = useCallback(createTooltip({ chartData }), [chartData]);
  const onCancel = useCallback(() => setSelected(null), []);
  const onSelect = useCallback((event, chartContext, chartEvent) => {
    const item = getItemFromChartEvent(chartEvent);
    setSelected(item.x);
  }, []);

  const contentElement = isLoaded ? (
    <>
      <Heatmap
        onSelect={onSelect}
        legend={legend}
        data={chartData}
        tooltipTemplate={tooltip}
      />
      <DeviceInfoModal
        visible={isSelectedVisible}
        device={selectedDevice}
        onCancel={onCancel}
      />
    </>
  ) : (
    <div className={classnames.loaderContainer}>
      <Loader size="large" />
    </div>
  );

  return (
    <div className={classnames.root}>
      {contentElement}
    </div>
  );
}));

export default Chart;
