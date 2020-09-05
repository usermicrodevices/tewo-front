import React from 'react';
import { Table } from 'antd';

import Format from 'elements/format';

import CellEditor from './cellEditor';

import style from './style.module.scss';

const EditorTable = ({ isEdditing, tableDataSource, data }) => (
  <Table
    className={style.viewer}
    columns={[
      {
        title: 'Информация',
        dataIndex: 'title',
        key: 'title',
      },
      {
        key: 'value',
        title: '',
        dataIndex: 'value',
        render: (value, second) => {
          const { dataIndex } = second;
          if (isEdditing && dataIndex in data.editable) {
            return (
              <CellEditor
                name={dataIndex}
                editor={data.editable[dataIndex]}
              />
            );
          }
          return <Format>{value}</Format>;
        },
      },
    ]}
    dataSource={tableDataSource}
    pagination={false}
  />
);

export default EditorTable;
