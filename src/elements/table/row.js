import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Loader from 'elements/loader';
import classNames from 'classnames';
import styles from './style.module.scss';

const ACTIONS_COLUMN_WIDT = 100;
const SCROLL_PANE_WIDTH = 25;

const Cell = (data, columns, freshItems, rowFunc, columnWidth, actions) => observer(({ index: rowIndex, style }) => {
  const index = rowFunc(rowIndex);
  const rowData = data[index];
  if (typeof rowData === 'undefined') {
    return <div style={style}><Loader /></div>;
  }
  return (
    <div
      style={style}
      className={classNames(
        styles.row,
        {
          [styles.highlightnew]: freshItems.has(rowIndex),
        },
      )}
    >
      {
        columns.map(({ align, key, transform }, columnIndex) => {
          let datum = rowData[key];
          if (transform) {
            datum = transform(datum);
          }
          if (typeof datum === 'undefined') {
            datum = <Loader />;
          }
          if (datum === null) {
            datum = '—';
          }
          const cellStyle = { textAlign: align || 'left', width: columnWidth[columnIndex] };
          return (
            <div
              key={key}
              style={cellStyle}
              className={styles['virtual-table-cell']}
            >
              { datum }
            </div>
          );
        })
      }
      { actions.isVisible && (
        <div
          style={{ width: ACTIONS_COLUMN_WIDT - SCROLL_PANE_WIDTH }}
          className={styles['virtual-table-cell']}
        >
          { actions.isEditable(rowData, index) && (
            <Button type="link" onClick={() => { actions.onEdit(rowData); }} icon={<EditOutlined />} />
          )}
        </div>
      )}
    </div>
  );
});

export { Cell as default, ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH };
