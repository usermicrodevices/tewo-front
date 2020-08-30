import React from 'react';
import Loader from 'elements/loader';
import { Table } from 'antd';

import { isColor } from 'utils/color';

import CellEditor from './cellEditor';

import style from './style.module.scss';

const Color = ({ children }) => (
  <>
    <div className={style.color} style={{ backgroundColor: children }} />
    {children}
  </>
);

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
          if (value === null) {
            return '—';
          }
          if (typeof value === 'undefined') {
            return <Loader />;
          }
          if (typeof value === 'boolean') {
            return value ? 'Да' : 'Нет';
          }
          if (isColor(value)) {
            return <Color>{value}</Color>;
          }
          return value;
        },
      },
    ]}
    dataSource={tableDataSource}
    pagination={false}
  />
);

export default EditorTable;
