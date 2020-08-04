import React from 'react';
import { inject, observer } from 'mobx-react';
import { VariableSizeGrid as Grid } from 'react-window';

import styles from './style.module.scss';
import Cell from './cell';
import { reaction } from 'mobx';

const ROW_HEIGHT = 54;
const DEFAULT_PRESCROLL_HEIGHT = 2150;

@inject('table')
@observer
class Content extends React.Component {
  gridRef;

  constructor(props) {
    super(props);

    this.gridRef = React.createRef();
  }

  setHover = (row) => {
    const { table } = this.props;
    table.hoverRow = row;
  };

  onScroll = ({ scrollTop }) => {
    const { table } = this.props;
    table.currentRow = Math.ceil(scrollTop / ROW_HEIGHT);
  };

  render() {
    const { table, width, columnWidth } = this.props;
    if (this.gridRef.current) {
      this.gridRef.current.resetAfterColumnIndex(0);
    }
    const {
      data,
      columns,
      hoverRow,
      freshItems,
    } = table;
    const rowFunc = (row) => {
      if (table.sort.direction === 'ascend') {
        return table.dataModel.data.length - row - 1;
      }
      return row;
    };
    return (
      <Grid
        onScroll={this.onScroll}
        ref={this.gridRef}
        className={styles['virtual-grid']}
        columnCount={table.columns.length}
        columnWidth={(index) => columnWidth[index]}
        height={DEFAULT_PRESCROLL_HEIGHT}
        rowCount={data.length}
        estimatedRowHeight={ROW_HEIGHT}
        rowHeight={() => ROW_HEIGHT}
        width={width}
      >
        {Cell(data, columns, hoverRow, this.setHover, freshItems, rowFunc)}
      </Grid>
    );
  }
}

export default Content;
