import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Input,
  Dropdown,
  Button,
  Space,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { withSize } from 'react-sizeme';

import Icon from 'elements/icon';
import Loader from 'elements/loader';

import Content from './content';
import ColumnsPicker from './columnsPicker';
import style from './style.module.scss';
import Header from './header';
import Filters from './filters';

const calculateColumnWidth = (tableWidth, columns) => {
  const destributedWidth = tableWidth - columns.reduce((cur, { width }) => cur + (width || 0), 0) - 25;
  const sum = columns.reduce((cur, { grow }) => cur + (grow || 0), 0);
  return columns.map(({ grow, width }) => width || grow / sum * destributedWidth);
};

@inject(({ table, filter }) => ({ table, filter }))
@observer
class TableComponent extends React.Component {
  state = {
    isFiltersOpen: false,
  };

  onColumnsPicked = (pickedColumns) => {
    const { table } = this.props;
    table.visibleColumns = pickedColumns;
  }

  onSearchChange = (action) => {
    const { filter } = this.props;
    filter.searchText = action.target.value;
  }

  onReorder = (columns) => {
    const { table } = this.props;
    table.reorderColumns(columns);
  }

  toggleFilters = () => {
    const { isFiltersOpen } = this.state;
    this.setState({ isFiltersOpen: !isFiltersOpen });
  }

  render() {
    const {
      table: {
        data,
        visibleColumns,
        columns,
      },
      filter: { searchText, filters },
      size,
    } = this.props;
    const columnWidth = calculateColumnWidth(size.width, columns.map(({ width }) => width));
    const { isFiltersOpen } = this.state;
    const isHaveFilters = Object.keys(filters).length !== 0;
    return (
      <div className={style.whole}>
        <div className={style.buttons}>
          <Input prefix={<Icon name="search-outline" />} value={searchText} onChange={this.onSearchChange} />
          <Space>
            <Dropdown overlay={<ColumnsPicker onReorder={this.onReorder} onChange={this.onColumnsPicked} visibleColumns={visibleColumns} />} placement="bottomRight">
              <Button>Колонки</Button>
            </Dropdown>
            { isHaveFilters && (
              <Button
                type={isFiltersOpen ? 'primary' : 'default'}
                icon={<FilterOutlined />}
                onClick={this.toggleFilters}
              />
            )}
          </Space>
        </div>
        { isFiltersOpen && <Filters /> }
        <Header columnWidth={columnWidth} />
        { data
          ? <Content width={size.width} columnWidth={columnWidth} />
          : <Loader className={style.loader} size={100} /> }
      </div>
    );
  }
}

export default withSize()(TableComponent);
