import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';

import Loader from 'elements/loader';
import classNames from 'classnames';
import Format from 'elements/format';
import NoData from 'elements/noData';

import styles from './style.module.scss';

const ACTIONS_COLUMN_WIDT = 70;
const SCROLL_PANE_WIDTH = 25;
const MAX_ROWS_AMOUNT = 620000;

const Row = (data, columns, freshItems, rowFunc, columnWidth, actions, onRowClick, openedRows) => withRouter(observer(({ index: rowIndex, style, history: { push } }) => {
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
    >
      <div
        className={classNames(
          rowData.className,
          styles.row,
          {
            [styles.highlightnew]: freshItems.has(index),
          },
        )}
        onClick={() => onRowClick(index)}
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
            { actions.detailsWidget && (
              <div className={styles.collapseicon} style={{ transform: `rotate(${openedRows.has(index) ? 90 : 0}deg)` }}>
                <RightOutlined />
              </div>
            )}
            { typeof actions.onEdit === 'function' && (
              <Button type="link" onClick={() => { actions.onEdit(rowData, push); }} icon={<EditOutlined style={{ transform: 'scale(1.37)' }} />} />
            )}
            { typeof actions.onDelete === 'function' && (
              <Popconfirm
                placement="left"
                title="Отмена операции невозможна. Продолжить удаление?"
                onConfirm={() => { actions.onDelete(rowData); }}
                okText="Да"
                cancelText="Нет"
              >
                <Button type="link" icon={<DeleteOutlined style={{ transform: 'scale(1.37)' }} />} />
              </Popconfirm>
            )}
          </div>
        )}
      </div>
      {openedRows.has(index) && (
        <actions.detailsWidget columnWidth={columnWidth} index={index} item={rowData} />
      )}
    </div>
  );
}));

export {
  Row as default, ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH, MAX_ROWS_AMOUNT,
};
