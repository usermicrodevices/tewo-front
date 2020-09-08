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

import { ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH } from './row';
import Content from './content';
import style from './style.module.scss';
import Header from './header';
import Filters from './filters';

const calculateColumnWidth = (tableWidth, columns, actions) => {
  const spacer = actions.isVisible ? ACTIONS_COLUMN_WIDT : SCROLL_PANE_WIDTH;
  const destributedWidth = tableWidth - columns.reduce((cur, { width }) => cur + (width || 0), 0) - spacer;
  const sum = columns.reduce((cur, { grow }) => cur + (grow || 0), 0);
  return columns.map(({ grow, width }) => width || grow / sum * destributedWidth);
};

@withSize()
@inject(({ table, filter }) => ({ table, filter }))
@observer
class TableComponent extends React.Component {
  actions = {};

  onSearchChange = (action) => {
    const { filter } = this.props;
    filter.searchText = action.target.value;
  }

  render() {
    const {
      table: {
        data,
        columns,
        actions,
      },
      filter: { searchText, isShowSearch },
      size,
      isFiltersOpen,
    } = this.props;
    const columnWidth = calculateColumnWidth(size.width, columns.map(({ width }) => width), actions);
    return (
      <div className={style.whole}>
        <div className={style.buttons}>
          { isShowSearch && <Input prefix={<Icon name="search-outline" />} value={searchText} onChange={this.onSearchChange} /> }
          { process.env.NODE_ENV !== 'production' && <p>{`Доступно ${data.length} записей`}</p> }
        </div>
        { isFiltersOpen && <Filters /> }
        <Header columnWidth={columnWidth} />
        <Content width={size.width} columnWidth={columnWidth} />
      </div>
    );
  }
}

export { TableComponent as default };
