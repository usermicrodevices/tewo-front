import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

export default observer(({
  exporter,
  text = 'Экспорт Excel',
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

  if (exporter.disabled) {
    return (
      <Tooltip title="Для выгрузки выберите в фильтрации диапазон дат и дождитесь загрузки данных">
        {buttonElement}
      </Tooltip>
    );
  }

  return (
    <Popconfirm
      title={exporter.confirmMessage}
      onConfirm={exporter.export}
      disabled={exporter.disabled}
      overlayStyle={{ width: 350 }}
      okText="Выгрузить"
      cancelText="Отменить"
    >
      {buttonElement}
    </Popconfirm>
  );
});
