import React from 'react';
import { observer } from 'mobx-react';

import Loader from 'elements/loader';
import classNames from 'classnames';
import styles from './style.module.scss';

const Cell = (data, columns, hover, freshItems, rowFunc, columnWidth) => observer(({ index: rowIndex, style }) => {
  const rowData = data[rowFunc(rowIndex)];
  if (typeof rowData === 'undefined') {
    return <div style={style}><Loader /></div>;
  }
  return (
    <div
      style={style}
      className={styles.row}
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
              className={classNames(
                styles['virtual-table-cell'],
                {
                  [styles.highlightnew]: freshItems > rowIndex && hover !== rowIndex,
                },
              )}
            >
              { datum }
            </div>
          );
        })
      }
    </div>
  );
});

export default Cell;
