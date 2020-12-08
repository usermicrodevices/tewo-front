import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';

const Chart = ({ table }) => {
  return (
    <Card>
      График
    </Card>
  );
};

export default inject('table')(observer(Chart));
