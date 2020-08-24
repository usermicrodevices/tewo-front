import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, Button, Modal, Space, Form,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import CellEditor from './cellEditor';

import style from './style.module.scss';

const Editor = ({ data, isModal, onCancel }) => {
  const [isEdditing, setIsEdduting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();

  if (typeof data === 'undefined') {
    return null;
  }

  const onSave = (changes) => {
    data.update(changes).finally(() => { setIsEdduting(false); setIsUpdating(false); });
    setIsUpdating(true);
  };

  const isHaveErrors = form.getFieldsError().filter(({ errors }) => errors.length).length !== 0;

  const Footer = () => {
    if (isEdditing) {
      return (
        <Space>
          <Button disabled={isUpdating} onClick={() => { setIsEdduting(false); }}>Отмена</Button>
          <Button
            disabled={isHaveErrors}
            loading={isUpdating}
            onClick={() => form.submit()}
            type="primary"
          >
            Сохранить
          </Button>
        </Space>
      );
    }
    return (
      <div className={style.footer}>
        <Button type="text" icon={<EditOutlined />} onClick={() => { setIsEdduting(true); }}>Редактировать</Button>
      </div>
    );
  };

  const { values, editable } = data;
  const tableDataSource = values.map((datum) => ({ key: datum.dataIndex, ...datum }));
  const formDataInitialValues = {};
  for (const { dataIndex } of values) {
    if (dataIndex in editable) {
      formDataInitialValues[dataIndex] = data[dataIndex];
    }
  }

  const table = (
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
            return value;
          },
        },
      ]}
      dataSource={tableDataSource}
      pagination={false}
    />
  );

  const Title = data.links ? () => (
    <div className={style.title}>
      <div className="ant-modal-title">{data.name}</div>
      <Space>
        { data.links.map(({ text, icon, link }) => (
          <Link key={link} to={link}>
            <Button onClick={onCancel} icon={<Icon name={icon} />}>{text}</Button>
          </Link>
        ))}
      </Space>
    </div>
  ) : () => <div className="ant-modal-title">{data.name}</div>;

  const EditorForm = ({ children }) => (
    <Form
      form={form}
      onFinish={onSave}
      initialValues={formDataInitialValues}
    >
      { children }
    </Form>
  );

  if (isModal) {
    return (
      <EditorForm>
        <Modal
          title={<Title />}
          visible
          confirmLoading={isUpdating}
          footer={<Footer />}
          onCancel={onCancel}
          width={800}
        >
          {table}
        </Modal>
      </EditorForm>
    );
  }
  return (
    <div className={style.space}>
      <EditorForm>
        <Title />
        {table}
        <Footer />
      </EditorForm>
    </div>
  );
};

export default observer(Editor);
