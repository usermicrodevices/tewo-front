import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';

const Chart = ({ element: { details } }) => {
  console.log(details);
  return <Card><div /></Card>;
};

export default inject('element')(observer(Chart));
