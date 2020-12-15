import React from 'react';
import { inject, observer } from 'mobx-react';
import { Input } from 'antd';
import { withSize } from 'react-sizeme';
import classnames from 'classnames';

import Icon from 'elements/icon';
import Format from 'elements/format';
import plural from 'utils/plural';

import { ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH } from './row';
import Content from './content';
import style from './style.module.scss';
import Header from './header';

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
        isHideTitleRow,
      },
      filter: { searchText, isShowSearch },
      size,
      className,
    } = this.props;
    const columnWidth = calculateColumnWidth(size.width, columns.map(({ width }) => width), actions);
    return (
      <div className={classnames(className, style.whole)}>
        { !isHideTitleRow && (
          <div className={style.buttons}>
            { isShowSearch && <Input placeholder="Поиск" allowClear prefix={<Icon name="search-outline" />} value={searchText} onChange={this.onSearchChange} /> }
            <p>{`${plural(data.length, ['Доступна', 'Доступно', 'Доступно'])} ${Format({ children: data.length })} ${plural(data.length, ['запись', 'записей', 'записи'])}`}</p>
          </div>
        )}
        <Header columnWidth={columnWidth} />
        <Content width={size.width} columnWidth={columnWidth} />
      </div>
    );
  }
}

export { TableComponent as default };
