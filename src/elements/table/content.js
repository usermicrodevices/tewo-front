import React from 'react';
import { inject, observer } from 'mobx-react';
import { VariableSizeList as List } from 'react-window';

import Loader from 'elements/loader';
import NoData from 'elements/noData';

import Row, { MAX_ROWS_AMOUNT } from './row';
import style from './style.module.scss';

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
      return table.data.length - row - 1;
    }
    return row;
  };

  render() {
    const { table, width, columnWidth } = this.props;
    const {
      data,
      columns,
      newElements,
      actions,
      isLoaded,
    } = table;
    if (!isLoaded) {
      return <Loader className={style.loader} size="large" />;
    }
    if (data.length === 0) {
      return (
        <NoData
          title="По результатам поиска совпадений не найдено"
          text="Повторите поиск или измените фильтры"
        />
      );
    }
    return (
      <List
        onScroll={this.onScroll}
        ref={this.listRef}
        columnCount={table.columns.length}
        height={DEFAULT_PRESCROLL_HEIGHT}
        itemCount={Math.min(MAX_ROWS_AMOUNT, data.length)}
        estimatedItemSize={ROW_HEIGHT}
        itemSize={(row) => (row === MAX_ROWS_AMOUNT - 1 ? 400 : ROW_HEIGHT)}
        width={width}
        data={data}
      >
        {
          Row(data, columns, newElements, this.rowFunc, columnWidth, actions)
        }
      </List>
    );
  }
}

export default Content;
