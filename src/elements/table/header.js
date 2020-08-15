import React from 'react';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';
import { Table } from 'antd';

import Sorter from './sorter';
import styles from './style.module.scss';

const Header = ({ table, columnWidth }) => {
  const style = (id) => ({
    width: columnWidth[id] + (id === columnWidth.length - 1) * 24,
    maxWidth: columnWidth[id] + (id === columnWidth.length - 1) * 24,
  });
  const { sort, columns } = table;

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
          </tr>
        </thead>
      </table>
    </>
  );
};

export default inject('table')(observer(Header));
