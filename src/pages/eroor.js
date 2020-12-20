import React from 'react';
import { Card } from 'antd';
import Typography from 'elements/typography';

const EroorPage = ({ error }) => (
  <Card title="Произошла ошибка">
    <p><Typography.Text>Обновите страницу</Typography.Text></p>
    <Typography.Text>{`Ошибка: ${error.message}`}</Typography.Text>
  </Card>
);

export default EroorPage;
