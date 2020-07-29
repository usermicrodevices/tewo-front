import React from 'react';
import { observer } from 'mobx-react';

import Loader from 'elements/loader';
import classNames from 'classnames';
import styles from './style.module.scss';

const Cell = (data, columns, hover, setHover) => observer(({
  columnIndex, rowIndex, style,
}) => {
  const { align, key, transform } = columns[columnIndex];
  const rowData = data[rowIndex];
  let datum = typeof rowData === 'undefined' ? columnIndex === 0 && <Loader /> : rowData[key];
  if (transform) {
    datum = transform(datum);
  }
  if (datum === null) {
    datum = <Loader />;
  }
  return (
    <div
      onMouseEnter={() => setHover(rowIndex)}
      onMouseLeave={() => setHover(-1)}
      style={{ ...style, textAlign: align || 'left' }}
      className={classNames(
        styles['virtual-table-cell'],
        {
          [styles.hover]: hover === rowIndex,
          [styles['virtual-table-cell-last']]: columnIndex === columns.length - 1,
        },
      )}
    >
      { datum }
    </div>
  );
});

export default Cell;
