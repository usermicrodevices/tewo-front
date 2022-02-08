import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tag, Input, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

import cn from './inputButton.module.scss';

const InputButton = ({ session: { tags }, onCreate }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const handleOnChange = React.useCallback((event) => {
    setInputValue(event.target.value);
  }, []);
  const [isEdit, setEdit] = React.useState(false);
  const edit = React.useCallback(() => {
    setEdit(true);
  }, []);

  const inputRef = React.useRef();
  React.useEffect(() => {
    const { current: input } = inputRef;
    if (input && !input.firstFocused) {
      input.firstFocused = true;
      input.focus();
    }
  });

  const handleCancel = React.useCallback(() => {
    setEdit(false);
    setInputValue('');
    setLoading(false);
  }, []);

  const handleSubmitTag = (event) => {
    event.preventDefault();
    setLoading(true);
    tags.add(inputValue).then(({ id }) => {
      handleCancel();
      onCreate(id);
    }).finally(() => {
      setLoading(false);
    });
    return false;
  };

  if (!isEdit) {
    return (
      <Button onClick={edit} type="text" size="small">
        <Tag>
          <PlusOutlined />
          Создать
        </Tag>
      </Button>
    );
  }

  return (
    <div className={cn.form}>
      <Input
        ref={inputRef}
        type="text"
        size="small"
        value={inputValue}
        onChange={handleOnChange}
        onPressEnter={handleSubmitTag}
      />
      <Button type="text" icon={<CloseOutlined />} disabled={isLoading} onClick={handleCancel} size="small" />
      <Button type="text" icon={<PlusOutlined />} disabled={inputValue.length === 0 && !isLoading} loading={isLoading} onClick={handleSubmitTag} size="small" />
    </div>
  );
};

export default inject('session')(observer(InputButton));
