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

  if (!editable) {
    for (const { dataIndex } of values) {
      if (dataIndex in editable) {
        formDataInitialValues[dataIndex] = data[dataIndex];
      }
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

  const footer = (
    <EditorFooter
      isEditable={!!editable}
      isEdditing={isEdditing}
      isHaveErrors={isHaveErrors}
      isUpdating={isUpdating}
      form={form}
      setIsEdduting={setIsEdduting}
    />
  );
  const table = <EditroTable data={data} tableDataSource={tableDataSource} isEdditing={isEdditing} />;

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
        footer={footer}
        onCancel={onCancel}
        width={800}
      >
        <EditorForm>
          {table}
        </EditorForm>
      </Modal>
    );
  }
  return (
    <div className={style.space}>
      <EditorForm>
        <Title />
        {table}
        {footer}
      </EditorForm>
    </div>
  );
};

export default observer(Editor);
