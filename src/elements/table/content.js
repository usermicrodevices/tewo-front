import React from 'react';
import { inject, observer } from 'mobx-react';
import { VariableSizeList as List } from 'react-window';

import Cell from './row';

const ROW_HEIGHT = 54;
const DEFAULT_PRESCROLL_HEIGHT = 2150;

@inject('table')
@observer
class Content extends React.Component {
  listRef;

  constructor(props) {
    super(props);

    this.listRef = React.createRef();
  }

  setHover = (row) => {
    const { table } = this.props;
    table.hoverRow = row;
  };

  onScroll = ({ scrollOffset }) => {
    const { table } = this.props;
    table.currentRow = Math.ceil(scrollOffset / ROW_HEIGHT);
  };

  rowFunc = (row) => {
    const { table } = this.props;
    if (table.sort.direction === 'ascend') {
      return table.dataModel.data.length - row - 1;
    }
    return row;
  };

  componentDidUpdate() {
    if (this.listRef.current) {
      this.listRef.current.resetAfterIndex(0);
    }
  }

  render() {
    const { table, width, columnWidth } = this.props;
    const {
      data,
      columns,
      hoverRow,
      freshItems,
    } = table;
    return (
      <List
        onScroll={this.onScroll}
        ref={this.listRef}
        columnCount={table.columns.length}
        height={DEFAULT_PRESCROLL_HEIGHT}
        itemCount={data.length}
        estimatedItemSize={ROW_HEIGHT}
        itemSize={() => ROW_HEIGHT}
        width={width}
        data={data}
      >
        {
          Cell(data, columns, hoverRow, this.setHover, freshItems, this.rowFunc, columnWidth)
        }
      </List>
    );
  }
}

export default Content;
