import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Loader from 'elements/loader';
import Cup from 'elements/cup';
import classNames from 'classnames';
import Format from 'elements/format';
import styles from './style.module.scss';

const ACTIONS_COLUMN_WIDT = 100;
const SCROLL_PANE_WIDTH = 25;

const Row = (data, columns, freshItems, rowFunc, columnWidth, actions) => observer(({ index: rowIndex, style }) => {
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
          { actions.isFormulaEditable && actions.isFormulaEditable(rowData, index) && (
            <Button type="link" onClick={() => { actions.onFillFormula(rowData); }} icon={<Cup isFilled={actions.isHaveFormula(rowData, index)} />} />
          )}
          { actions.isEditable(rowData, index) && (
            <Button type="link" onClick={() => { actions.onEdit(rowData); }} icon={<EditOutlined />} />
          )}
        </div>
      )}
    </div>
  );
});

export { Row as default, ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH };
