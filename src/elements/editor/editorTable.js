import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Form } from 'antd';
import classNames from 'classnames';

import Format from 'elements/format';

import CellEditor from './cellEditor';

import style from './style.module.scss';

const EditorTable = ({
  isEdditing, data, session,
}) => {
  console.log('rerender table');
  const tableDataSource = data.values.map((datum) => ({ key: datum.dataIndex, ...datum }));
  return (
    <Table
      className={style.viewer}
      columns={[
        {
          title: 'Информация',
          dataIndex: 'title',
          width: 300,
          render: (text, { dataIndex }) => (
            <span
              className={classNames({
                [style.required]: data.editable[dataIndex]?.isRequired,
              })}
            >
              { text }
            </span>
          ),
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

export default inject('session')(observer(EditorTable));
