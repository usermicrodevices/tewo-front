import React from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { Redirect, withRouter } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import { FixedSizeList as List } from 'react-window';

import Loader from 'elements/loader';

import initRowsRenderer from './row';
import classes from './index.module.scss';

const packeges = ({
  size: { width, height },
  match: { params: { id }, url },
  manager,
}) => {
  if (!manager.sessions.isLoaded) {
    return (
      <div className={classes.loader}>
        <Loader />
      </div>
    );
  }
  const session = manager.sessions.get(parseInt(id, 10));
  const { rowsCount, renderer } = initRowsRenderer(width, session.devices.length);
  if (typeof session === 'undefined') {
    return <Redirect to={url.split('/').slice(0, -1).join('/')} />;
  }
  return (
    <Provider uploadSession={session}>
      <List
        itemCount={rowsCount}
        itemSize={170}
        width={width}
        height={height}
      >
        {renderer}
      </List>
    </Provider>
  );
};

export default withSize({ monitorHeight: true })(withRouter(inject('manager')(observer(packeges))));
