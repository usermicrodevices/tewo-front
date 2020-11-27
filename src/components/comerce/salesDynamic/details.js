import React from 'react';
import { observer } from 'mobx-react';
import Loader from 'elements/loader';
import { Table } from 'antd';

const Details = ({ columnWidth, index, item }) => {
  if (!item.isDetailsLoaded) {
    return <Loader />;
  }
  const { details } = item;
  return <Table />;
};

export default observer(Details);
