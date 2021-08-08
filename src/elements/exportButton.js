import React from 'react';
import {
  Button, Popconfirm, Tooltip, Input, Form,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

export default observer(({
  exporter,
  text = 'Экспорт на email',
  icon = <DownloadOutlined />,
}) => {
  if (!exporter) {
    return null;
  }

  const buttonElement = (
    <Button
      loading={exporter.loading}
      disabled={exporter.disabled}
      icon={icon}
      title=""
    >
      {text}
    </Button>
  );

  if (exporter.loading) {
    return (
      <Tooltip title="Идет выгрузка">
        {buttonElement}
      </Tooltip>
    );
  }

  if (exporter.disabled) {
    return (
      <Tooltip title="Для выгрузки выберите в фильтрации диапазон дат">
        {buttonElement}
      </Tooltip>
    );
  }

  const TitleElement = (
    <div>
      <p>{exporter.confirmMessage}</p>
      <Form onSubmitCapture={exporter.export}>
        <Input value={exporter.email} placeholder="Email" type="email" onChange={(event) => exporter.onChangeEmail(event.target.value)} />
      </Form>
    </div>
  );

  return (
    <Popconfirm
      title={TitleElement}
      onConfirm={exporter.export}
      disabled={exporter.disabled}
      overlayStyle={{ width: 350 }}
      okButtonProps={{
        disabled: exporter.isSendDisabled,
      }}
      okText="Отправить"
      cancelText="Отменить"
    >
      {buttonElement}
    </Popconfirm>
  );
});
