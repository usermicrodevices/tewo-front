import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Button, Modal, Space, Form, message,
} from 'antd';
import { observer } from 'mobx-react';
import Icon from 'elements/icon';
import RecipeEditor from 'models/drinks/recipeEditor';

import EditorTable from './editorTable';
import EditorFooter from './editorFooter';
import RecipeEditroTable from './recipeEditorTable';

import style from './style.module.scss';

const Editor = ({
  data,
  isModal,
  onCancel,
  match: { params: { action }, url },
  history,
}) => {
  const [isEdditing, setRawIsEdditing] = useState(action === 'edit' || data.id === null);
  useEffect(() => {
    if (!isEdditing && action === 'edit') {
      setIsEdditing(true);
    }
  });
  const setIsEdditing = (v) => {
    if (isRecipeMode && !v) { data.cancel(); }
    if (!isModal) { history.push(url.replace(!v ? 'edit' : 'view', v ? 'edit' : 'view')); }
    if (data.id === null) { onCancel(); }
    setRawIsEdditing(v);
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();
  const isRecipeMode = data instanceof RecipeEditor;

  if (typeof data === 'undefined') {
    return null;
  }

  const onSave = (changes) => {
    setIsUpdating(true);
    data.update(changes)
      .then(() => {
        message.success('Данные успешно обновлены');
        setIsEdditing(false);
      })
      .catch(() => {
        message.error('При обновлении данных призошли ошибки. Проверьте корректность введённых данных');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const isHaveErrors = form.getFieldsError().filter(({ errors }) => errors.length).length !== 0;

  const { values, editable } = data;
  const formDataInitialValues = {};

  if (editable) {
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
      setIsEdditing={setIsEdditing}
      isModal={isModal}
    />
  );

  const table = isRecipeMode
    ? <RecipeEditroTable data={data} isEdditing={isEdditing} />
    : <EditorTable data={data} isEdditing={isEdditing} />;

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
    <div className={style.nomodal}>
      <EditorForm>
        {table}
        {footer}
      </EditorForm>
    </div>
  );
};

export default withRouter(observer(Editor));
