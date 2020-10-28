import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Loader from 'elements/loader';
import classNames from 'classnames';
import Format from 'elements/format';
import NoData from 'elements/noData';

import styles from './style.module.scss';

const ACTIONS_COLUMN_WIDT = 70;
const SCROLL_PANE_WIDTH = 25;
const MAX_ROWS_AMOUNT = 620000;

const Row = (data, columns, freshItems, rowFunc, columnWidth, actions) => withRouter(observer(({ index: rowIndex, style, history: { push } }) => {
  const index = rowFunc(rowIndex);
  const rowData = data[index];
  if (rowIndex === MAX_ROWS_AMOUNT - 1) {
    return (
      <div style={style} className={styles.row}>
        <NoData
          title="Достигнуто максимальное число строк"
          text="Измените найстройки фильтации или сортировки"
        />
      </div>
    );
  }
  if (typeof rowData === 'undefined') {
    return <div style={style}><Loader /></div>;
  }
  return (
    <div
      style={style}
      className={classNames(
        styles.row,
        {
          [styles.highlightnew]: freshItems.has(index),
        },
      )}
    >
      {
        columns.map(({ align, key, transform }, columnIndex) => {
          const width = columnWidth[columnIndex];
          let datum = rowData[key];
          if (transform) {
            datum = transform(datum, rowData, width);
          }
          const cellStyle = { textAlign: align || 'left', width };
          return (
            <div key={key} style={cellStyle} className={styles['virtual-table-cell']}>
              <Format width={width}>{datum}</Format>
            </div>
          );
        })
      }
      { actions.isVisible && (
        <div
          style={{ width: ACTIONS_COLUMN_WIDT - SCROLL_PANE_WIDTH }}
          className={classNames(styles['virtual-table-cell'], styles.lastcolumn, styles.actions)}
        >
          <Button type="link" onClick={() => { actions.onEdit(rowData, push); }} icon={<EditOutlined style={{ transform: 'scale(1.37)' }} />} />
        </div>
      )}
    </div>
  );
}));

export {
  Row as default, ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH, MAX_ROWS_AMOUNT,
};
