import React from 'react';
import { Popover } from 'antd';
import Typography from 'elements/typography';

import Format from 'elements/format';

// наведение в Поповере информацию по нему:  название, описание, тип, дата создания
export default (packet) => {
  if (!packet) {
    return <Format>{ packet }</Format>;
  }
  const {
    name, description, typeName, created,
  } = packet;
  console.log(created);
  return (
    <Popover
      content={(
        <div>
          <p>
            <Typography.Caption>Описание</Typography.Caption>
            <Typography.Value><Format>{description}</Format></Typography.Value>
          </p>
          <p>
            <Typography.Caption>Тип</Typography.Caption>
            <Typography.Value><Format>{typeName}</Format></Typography.Value>
          </p>
          <p>
            <Typography.Caption>Дата создания</Typography.Caption>
            <Typography.Value><Format>{created}</Format></Typography.Value>
          </p>
        </div>
      )}
      title={name}
    >
      {name}
    </Popover>
  );
};