import React, { useCallback } from 'react';
import { Checkbox } from 'antd';
import { observer } from 'mobx-react';

import { Row } from 'elements/collapse';

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

export default UserPointsList;
