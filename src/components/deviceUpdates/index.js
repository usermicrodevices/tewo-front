import React from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import { FixedSizeList as List } from 'react-window';

import Loader from 'elements/loader';

import initRowsRenderer from './row';
import classes from './index.module.scss';

const DeviceUpdates = ({
  size: { width, height },
  match: { params: { id } },
  session: { devices },
}) => {
  const { rowsCount, renderer } = initRowsRenderer(width, 1000);
  const device = devices.get(parseInt(id, 10));
  console.log(devices, device);
  if (typeof device === 'undefined') {
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );
  }
  return (
    <Provider device={device}>
      <List
        itemCount={rowsCount}
        itemSize={100}
        width={width}
        height={height}
      >
        {renderer}
      </List>
    </Provider>
  );
};

export default withSize({ monitorHeight: true })(withRouter(inject('session')(observer(DeviceUpdates))));
