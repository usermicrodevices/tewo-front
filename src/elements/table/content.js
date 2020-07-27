import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { VariableSizeGrid as Grid } from 'react-window';
import classNames from 'classnames';

import styles from './style.module.scss';

const ROW_HEIGHT = 54;
const DEFAULT_PRESCROLL_HEIGHT = 2150;

const Cell = (data, columns, columnStyles) => ({
  columnIndex, rowIndex, style,
}) => (
  <div
    style={{ ...style, ...columnStyles[columnIndex] }}
    className={classNames(
      styles['virtual-table-cell'],
      {
        [styles['virtual-table-cell-last']]: columnIndex === columns.length - 1,
      },
    )}
  >
    { data[rowIndex][columns[columnIndex]] }
  </div>
);

function Content({ table, width, columnWidth }) {
  const gridRef = useRef();
  if (gridRef.current) {
    gridRef.current.resetAfterColumnIndex(0);
  }
  const { filteredData, columns } = table;
  return (
    <Grid
      ref={gridRef}
      className={styles['virtual-grid']}
      columnCount={table.columns.length}
      columnWidth={(index) => columnWidth[index]}
      height={DEFAULT_PRESCROLL_HEIGHT}
      rowCount={filteredData.length}
      estimatedRowHeight={ROW_HEIGHT}
      rowHeight={() => ROW_HEIGHT}
      width={width}
    >
      {Cell(filteredData, columns.map(({ key }) => key), columns.map(({ align }) => ({ textAlign: align || 'left' })))}
    </Grid>
  );
}

export default inject('table')(observer(Content));
