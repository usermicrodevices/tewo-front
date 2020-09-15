import React from 'react';
import { inject } from 'mobx-react';
import { Table, Form } from 'antd';

import Format from 'elements/format';

import CellEditor from './cellEditor';

import style from './style.module.scss';

const EditorTable = ({
  isEdditing, data, session,
}) => {
  const tableDataSource = data.values.map((datum) => ({ key: datum.dataIndex, ...datum }));
  return (
    <Table
      className={style.viewer}
      columns={[
        {
          title: 'Информация',
          dataIndex: 'title',
          width: 300,
        },
        {
          title: '',
          dataIndex: 'value',
          render: (value, column) => {
            const { dataIndex } = column;
            if (isEdditing) {
              if (dataIndex in data.editable) {
                return (
                  <CellEditor
                    name={dataIndex}
                    editor={data.editable[dataIndex]}
                  />
                );
              }
              if (dataIndex === 'regionName') {
                return (
                  <Form.Item shouldUpdate={({ cityId: oldCityId }, { cityId }) => oldCityId !== cityId}>
                    {
                      ({ getFieldValue }) => {
                        const region = session.locations.getRegionByCity(getFieldValue('cityId'));
                        return <Format>{region ? region.name : region}</Format>;
                      }
                    }
                  </Form.Item>
                );
              }
            }
            return <Format>{value}</Format>;
          },
        },
      ]}
      dataSource={tableDataSource}
      pagination={false}
    />
  );
};

export default inject('session')(EditorTable);
