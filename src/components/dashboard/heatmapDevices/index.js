import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { withSize } from 'react-sizeme';

import Heatmap from 'elements/chart/heatmap';
import Loader from 'elements/loader';
import DeviceInfoModal from './deviceInfoModal';

import { createTooltip, getItemFromChartEvent } from './configuration';
import classnames from './index.module.scss';

const HeaetmapDevices = withSize()(inject('storage')(observer(({ storage }) => {
  const {
    isLoaded, chartData, isSelectedVisible, setSelected, selectedDevice, legend,
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
})));

export default HeaetmapDevices;
