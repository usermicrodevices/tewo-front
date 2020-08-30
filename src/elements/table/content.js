import React from 'react';
import { inject, observer } from 'mobx-react';
import { VariableSizeList as List } from 'react-window';

import Loader from 'elements/loader';

import Cell from './row';
import NoData from './noData';

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

  componentDidUpdate() {
    if (this.listRef.current) {
      this.listRef.current.resetAfterIndex(0);
    }
  }

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

  render() {
    const { table, width, columnWidth } = this.props;
    const {
      data,
      rawData,
      columns,
      newElements,
      actions,
    } = table;
    if (rawData.length === 0) {
      return <Loader size="large" />;
    }
    if (data.length === 0) {
      return <NoData />;
    }
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
          Cell(data, columns, newElements, this.rowFunc, columnWidth, actions)
        }
      </List>
    );
  }
}

export default Content;
