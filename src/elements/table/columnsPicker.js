import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Checkbox, Card, Button,
} from 'antd';

import Icon from 'elements/icon';

function swap(arr, i) {
  arr.splice(i, 2, arr[i + 1], arr[i]);
}

const ColumnsPicker = ({ table, onChange, visibleColumns }) => (
  <Card>
    <Checkbox.Group onChange={onChange} value={visibleColumns}>
      <table>
        <tbody>
          {
            table && table.allColumns.map(({ title, key }, id) => {
              const onUp = () => table.swapColumns(id - 1);
              const onDown = () => table.swapColumns(id);
              const isNotFirst = id > 0;
              const isNotLast = id < table.allColumns.length - 1;
              return (
                <tr key={key}>
                  <td><Checkbox value={key}>{title}</Checkbox></td>
                  <td>{isNotFirst && <Button onClick={onUp} type="text" icon={<Icon name="arrow-upward-outline" />} />}</td>
                  <td>{isNotLast && <Button onClick={onDown} type="text" icon={<Icon name="arrow-downward-outline" />} />}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </Checkbox.Group>
  </Card>
);

export default inject('table')(observer(ColumnsPicker));
