import React from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox, Card, Space } from 'antd';

const ColumnsPicker = ({ table, onChange, visibleColumns }) => (
  <Card>
    <Checkbox.Group onChange={onChange} value={visibleColumns}>
      <Space direction="vertical">
        {
          table && table.allColumns.map(({ title, key }) => (
            <Checkbox key={key} value={key}>{title}</Checkbox>
          ))
        }
      </Space>
    </Checkbox.Group>
  </Card>
);

export default inject('table')(observer(ColumnsPicker));
