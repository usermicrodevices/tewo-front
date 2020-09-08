import React from 'react';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';
import { Table } from 'antd';

import Sorter from './sorter';
import styles from './style.module.scss';
import { SCROLL_PANE_WIDTH } from './row';

const Header = ({ table, columnWidth }) => {
  const { sort, columns, actions } = table;
  const lastColumnAddition = SCROLL_PANE_WIDTH * (!actions || !actions.isVisible);
  const style = (id) => {
    const width = columnWidth[id] + lastColumnAddition * (id === columnWidth.length - 1);
    return {
      width,
      maxWidth: width,
    };
  };

  const onChangeSort = (key) => () => {
    table.changeSort(key);
  };
  return (
    <>
      { false && <Table /> }
      <table>
        <thead className="ant-table-thead">
          <tr>
            {
              columns.map(({ key, title, sortDirections }, id) => (
                <th
                  key={key}
                  role={sortDirections && 'button'}
                  tabIndex={sortDirections && id}
                  style={style(id)}
                  className={classnames('ant-table-cell', { [styles.sortable]: !!sortDirections })}
                  onClick={sortDirections && onChangeSort(key)}
                >
                  <div>
                    <span>{title}</span>
                    {
                      sortDirections && <Sorter sortOrder={sort.column === key && sort.direction} sortDirections={sortDirections} />
                    }
                  </div>
                </th>
              ))
            }
            { actions.isVisible && (
              <th
                style={{
                  width: 100,
                  maxWidth: 100,
                }}
                className="ant-table-cell"
              >
                <div />
              </th>
            )}
          </tr>
        </thead>
      </table>
    </>
  );
};

export default inject('table')(observer(Header));
