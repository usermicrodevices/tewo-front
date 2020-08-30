import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Modal, Space, Form,
} from 'antd';
import { observer } from 'mobx-react';
import Icon from 'elements/icon';

import EditroTable from './editorTable';
import EditorFooter from './editorFooter';

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

  const { values, editable } = data;
  const tableDataSource = values.map((datum) => ({ key: datum.dataIndex, ...datum }));
  const formDataInitialValues = {};
  for (const { dataIndex } of values) {
    if (dataIndex in editable) {
      formDataInitialValues[dataIndex] = data[dataIndex];
    }
  }

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
      <Modal
        title={<Title />}
        visible
        confirmLoading={isUpdating}
        footer={<EditorFooter isEdditing={isEdditing} isHaveErrors={isHaveErrors} isUpdating={isUpdating} form={form} setIsEdduting={setIsEdduting} />}
        onCancel={onCancel}
        width={800}
      >
        <EditorForm>
          <EditroTable data={data} tableDataSource={tableDataSource} isEdditing={isEdditing} />
        </EditorForm>
      </Modal>
    );
  }
  return (
    <div className={style.space}>
      <EditorForm>
        <Title />
        <EditroTable data={data} tableDataSource={tableDataSource} isEdditing={isEdditing} />
        <EditorFooter isEdditing={isEdditing} isHaveErrors={isHaveErrors} isUpdating={isUpdating} form={form} setIsEdduting={setIsEdduting} />
      </EditorForm>
    </div>
  );
};

export default observer(Editor);
