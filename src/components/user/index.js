import React, { useCallback } from 'react';
import { Card, Checkbox, Button } from 'antd';
import { observer, inject } from 'mobx-react';

import { Row } from 'elements/collapse';
import Typography from 'elements/typography';

import styles from './styles.module.scss';

const UserPointCheckbox = observer(({ point, onChange }) => (
  <Checkbox
    name={point.id}
    checked={point.checked}
    onChange={onChange}
  >
    {point.name}
  </Checkbox>
));

const UserOverviewHeader = observer(({ user }) => {
  const { isAllEnabled, companiesNamesList, enableAllPoints } = user;

  return (
    <header>
      <Typography.Title level={3}>Доступные объекты пользователя</Typography.Title>
      <Typography.Paragraph>Выберите объекты, к которым у пользователя должен быть доступ. По умолчанию доступны все объекты.</Typography.Paragraph>
      {isAllEnabled ? (
        <Typography.Paragraph type="warning">
          <span>Сейчас у пользователя есть доступ ко всем объектам компаний: </span>
          <span>{companiesNamesList.join(', ')}</span>
        </Typography.Paragraph>
      ) : <Button onClick={enableAllPoints}>Дать доступ на все объекты</Button>}
    </header>
  );
});

const UserPointsList = observer(({ user }) => {
  const points = user.salePointsTableData;
  const loading = points === undefined;

  const onChangePoint = useCallback((evt) => {
    const { target: { name: id, checked } } = evt;

    user.setPoint(id, checked);
  }, [user]);

  return (
    <div className={styles.content}>
      {loading ? null : points.map((sp) => (
        <Row key={sp.id}>
          <UserPointCheckbox point={sp} onChange={onChangePoint} />
        </Row>
      ))}
    </div>
  );
});

function UserOverview({ element }) {
  return (
    <Card>
      <UserOverviewHeader user={element} />
      <UserPointsList user={element} />
    </Card>
  );
}

export default inject('element')(observer(UserOverview));
