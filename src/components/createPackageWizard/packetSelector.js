import React from 'react';
import { inject, observer, Provider } from 'mobx-react';
import {
  Modal,
  Button,
  Table,
  Input,
  Space,
} from 'antd';

import Format from 'elements/format';
import { FiltersButton } from 'elements/filters';
import Icon from 'elements/icon';

import classNames from './css.module.scss';

const render = (value) => <Format>{value}</Format>;

const columns = (onSubmit) => [
  {
    title: 'ID',
    dataIndex: 'id',
    render,
  },
  {
    title: 'Название',
    dataIndex: 'name',
    render,
  },
  {
    title: 'Версия',
    dataIndex: 'version',
    render,
  },
  {
    title: 'Тип',
    dataIndex: 'typeName',
    render,
  },
  {
    title: '',
    dataIndex: 'submit',
    render: (_, { id }) => <Button onClick={() => { onSubmit(id); }}>Выбрать</Button>,
  },
];

const selector = inject('manager')(observer(({
  isVisible,
  onSubmit,
  onCancel,
  manager: { packets },
}) => {
  const { filter } = packets;
  const onSearchChange = (action) => {
    filter.searchText = action.target.value;
  };
  const title = (
    <div className={classNames.title}>
      <div>Выбор пакета</div>
      <Space>
        <Input placeholder="Поиск" allowClear prefix={<Icon name="search-outline" />} value={filter.searchText} onChange={onSearchChange} />
        <Provider filter={filter}>
          <FiltersButton />
        </Provider>
      </Space>
    </div>
  );

  return (
    <Modal
      title={title}
      visible={isVisible}
      width="75vw"
      bodyStyle={{
        maxHeight: '75vh',
        overflowY: 'auto',
      }}
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>Отмена</Button>}
    >
      <Table
        columns={columns(onSubmit)}
        dataSource={packets.dataSource}
        pagination={false}
      />
    </Modal>
  );
}));

export default selector;
