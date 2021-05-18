import React from 'react';
import { inject, observer, Provider } from 'mobx-react';
import {
  Space, Button, Progress, message,
 } from 'antd';
import { Redirect, withRouter } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import { FixedSizeList } from 'react-window';
import Card from 'elements/card';

import Loader from 'elements/loader';

import initRowsRenderer from './row';
import classes from './index.module.scss';

const List = inject('uploadSession')(observer(withSize({ monitorHeight: true })(({
  size: { width, height },
  uploadSession: session,
}) => {
  const { rowsCount, renderer } = initRowsRenderer(width, session.devices.length);
  return (
    <FixedSizeList
      itemCount={rowsCount}
      itemSize={170}
      width={width}
      height={height}
    >
      {renderer}
    </FixedSizeList>
  );
})));

const Actions = inject('uploadSession')(observer(withRouter(({
  uploadSession: session,
  history,
}) => (
  <div className={classes.actions}>
    <Card>
      {`Статус: ${session.statusName}${session.isLoading ? ` (${session.devicesReadyCount}/${session.devicesCount})` : ''}`}
      <Progress percent={session.progress} showInfo={false} />
    </Card>
    <Card>
      <Space>
        <Button onClick={history.goBack}>Назад</Button>
        { session.isLoadedWithEroors && <Button onClick={() => { message.error('Функциональность не реализована'); }}>Перезапустить неудавшиеся</Button> }
        { session.isСancelable && <Button loading={session.isCanceling} disabled={session.isCanceling} onClick={() => { session.cancel().then(history.goBack); }}>Отменить загрузку</Button> }
      </Space>
    </Card>
  </div>
))));

const packeges = ({
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
  if (typeof session === 'undefined') {
    return <Redirect to={url.split('/').slice(0, -1).join('/')} />;
  }
  return (
    <Provider uploadSession={session}>
      <Card>
        <List />
      </Card>
      <Actions />
    </Provider>
  );
};

export default withRouter(inject('manager')(observer(packeges)));
