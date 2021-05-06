import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'antd';

import Loader from 'elements/loader';
import Format from 'elements/format';

import classes from './tableWidget.module.scss';

const GenericTable = (columns) => inject('storage')(observer(({ storage }) => {
  if (!storage.isLoaded) {
    return <div className={classes.root}><Loader /></div>;
  }
  const withRenderColumns = columns.map((column) => ({
    render: (value) => <Format>{ value }</Format>,
    ...column,
  }));
  return (
    <div className={classes.root}>
      <Table pagination={false} dataSource={storage.rows} columns={withRenderColumns} />
    </div>
  );
}));

export default GenericTable;
