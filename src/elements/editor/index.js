import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, Button, Modal, Space,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import Icon from 'elements/icon';
import CellEditor from './cellEditor';

import style from './style.module.scss';

const Editor = ({ data, isModal, onCancel }) => {
  const [isEdditing, setIsEdduting] = useState(false);
  const [prey, initData] = useState(null);

  useEffect(() => {
    if (prey === null) {
      initData(data.clone());
    }
  });

  if (typeof data === 'undefined') {
    return null;
  }

  if (prey === null) {
    return null;
  }

  const onSave = () => {
    console.log('clicked');
    data.update(prey).finally(() => { setIsEdduting(false); });
  };

  const Footer = () => {
    if (isEdditing) {
      return (
        <Space>
          <Button disabled={data.isUpdating} onClick={() => { setIsEdduting(false); }}>Отмена</Button>
          <Button loading={data.isUpdating} onClick={onSave} type="primary">Сохранить</Button>
        </Space>
      );
    }
    return (
      <div className={style.footer}>
        <Button type="text" icon={<EditOutlined />} onClick={() => { setIsEdduting(true); }}>Редактировать</Button>
      </div>
    );
  };

  const table = (
    <Table
      className={style.viewer}
      columns={[
        {
          title: 'Информация',
          dataIndex: 'title',
        },
        {
          title: '',
          dataIndex: 'value',
          render: (value, { dataIndex }) => {
            if (isEdditing && dataIndex in data.editable) {
              return (
                <CellEditor
                  onChange={({ target: { value: val } }) => { console.log(prey[dataIndex], val, prey.table[1]); prey[dataIndex] = val; }}
                  value={value}
                  editor={data.editable[dataIndex]}
                />
              );
            }
            return value;
          },
        },
      ]}
      dataSource={prey.table}
      pagination={false}
    />
  );

  const Title = data.links ? () => (
    <div className={style.title}>
      <div className="ant-modal-title">{prey.name}</div>
      <Space>
        { data.links.map(({ text, icon, link }) => (
          <Link key={link} to={link}><Button onClick={onCancel} icon={<Icon name={icon} />}>{text}</Button></Link>
        ))}
      </Space>
    </div>
  ) : () => prey.name;

  if (isModal) {
    return (
      <Modal
        title={<Title />}
        visible
        confirmLoading={data.isUpdating}
        footer={<Footer />}
        onCancel={onCancel}
        width={800}
      >
        {table}
      </Modal>
    );
  }
  return (
    <div>
      <Title />
      {table}
      <Footer />
    </div>
  );
};

export default observer(Editor);
