import React from 'react';
import { Card } from 'antd';

const EroorPage = ({ error }) => {
  console.log(error);
  return (
    <Card title="Произошла ошибка">Обновите страницу</Card>
  );
};

export default EroorPage;
