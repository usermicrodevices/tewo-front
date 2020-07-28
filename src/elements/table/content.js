import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { VariableSizeGrid as Grid } from 'react-window';

import styles from './style.module.scss';
import Cell from './cell';

const ROW_HEIGHT = 54;
const DEFAULT_PRESCROLL_HEIGHT = 2150;

function Content({ table, width, columnWidth }) {
  const gridRef = useRef();
  if (gridRef.current) {
    gridRef.current.resetAfterColumnIndex(0);
  }
  const { filteredData, columns, hoverRow } = table;
  const setHover = (row) => {
    table.hoverRow = row;
  };
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
      {Cell(filteredData, columns, hoverRow, setHover)}
    </Grid>
  );
}

export default inject('table')(observer(Content));
