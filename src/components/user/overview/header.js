import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import cx from 'classnames';

import Typography from 'elements/typography';

const UserOverviewHeader = observer(({ user, className }) => {
  const { isAllEnabled, companiesNamesList, enableAllPoints } = user;

  const companiesDescriptionElement = isAllEnabled ? (
    <Typography.Paragraph type="warning">
      <span>Сейчас у пользователя есть доступ ко всем объектам компаний: </span>
      <span>{companiesNamesList.join(', ')}</span>
    </Typography.Paragraph>
  ) : <Button onClick={enableAllPoints}>Дать доступ на все объекты</Button>;

  const descriptionElement = companiesNamesList.length === 0 ? (
    <Typography.Paragraph type="danger">
      У пользователя нет активных компаний. Перейдите в раздел
      {' '}
      <Typography.Link to={user.viewPath}>общая информация</Typography.Link>
      {' '}
      и выберите доступные пользователю компании.
    </Typography.Paragraph>
  ) : companiesDescriptionElement;

  return (
    <header className={cx([className])}>
      <Typography.Title level={3}>Доступные объекты пользователя</Typography.Title>
      <Typography.Paragraph>Выберите объекты, к которым у пользователя должен быть доступ. По умолчанию доступны все объекты.</Typography.Paragraph>
      {descriptionElement}
    </header>
  );
});

export default UserOverviewHeader;
