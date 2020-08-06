import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Input,
  Dropdown,
  Button,
} from 'antd';
import { withSize } from 'react-sizeme';

import Icon from 'elements/icon';
import Loader from 'elements/loader';

import Content from './content';
import ColumnsPicker from './columnsPicker';
import style from './style.module.scss';
import Header from './header';

const calculateColumnWidth = (tableWidth, columns) => {
  const destributedWidth = tableWidth - columns.reduce((cur, { width }) => cur + (width || 0), 0) - 25;
  const sum = columns.reduce((cur, { grow }) => cur + (grow || 0), 0);
  return columns.map(({ grow, width }) => width || grow / sum * destributedWidth);
};

@inject('table')
@observer
class TableComponent extends React.Component {
  componentDidMount() {
    const { table } = this.props;
    table.filter = '';
  }

  onColumnsPicked = (pickedColumns) => {
    const { table } = this.props;
    table.visibleColumns = pickedColumns;
  }

  onFilterChange = (action) => {
    const { table } = this.props;
    table.filter = action.target.value;
  }

  onReorder = (columns) => {
    const { table } = this.props;
    table.reorderColumns(columns);
  }

  render() {
    const {
      table: {
        data,
        visibleColumns,
        columns,
        filter,
      },
      size,
    } = this.props;
    const columnWidth = calculateColumnWidth(size.width, columns);
    return (
      <div className={style.whole}>
        <div className={style.buttons}>
          <Input prefix={<Icon name="search-outline" />} value={filter} onChange={this.onFilterChange} />
          <Dropdown overlay={<ColumnsPicker onReorder={this.onReorder} onChange={this.onColumnsPicked} visibleColumns={visibleColumns} />} placement="bottomRight">
            <Button>Колонки</Button>
          </Dropdown>
        </div>
        <Header columnWidth={columnWidth} />
        { data
          ? <Content width={size.width} columnWidth={columnWidth} />
          : <Loader className={style.loader} size={100} /> }
      </div>
    );
  }
}

export default withSize()(TableComponent);
