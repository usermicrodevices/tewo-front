import React from 'react';
import { observer } from 'mobx-react';

import Loader from 'elements/loader';
import classNames from 'classnames';
import styles from './style.module.scss';

const Cell = (data, columns) => observer(({
  columnIndex, rowIndex, style,
}) => {
  const { align, key, transform } = columns[columnIndex];
  let datum = data[rowIndex][key];
  if (transform) {
    datum = transform(datum);
  }
  if (datum === null) {
    datum = <Loader />;
  }
  return (
    <div
      style={{ ...style, textAlign: align || 'left' }}
      className={classNames(
        styles['virtual-table-cell'],
        {
          [styles['virtual-table-cell-last']]: columnIndex === columns.length - 1,
        },
      )}
    >
      { datum }
    </div>
  );
});

export default Cell;
