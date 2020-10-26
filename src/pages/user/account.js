import React from 'react';
import { Card, Divider } from 'antd';

import Typography from 'elements/typography';

const Account = () => (
  <Card title="Личный кабинет">
    <Typography.Title level={1}>Пользователь (Заголовок 1) [заг страницы]</Typography.Title>
    <Typography.Title level={2}>Пользователь (Заголовок 2) [заг модалки]</Typography.Title>
    <Typography.Title level={3}>Пользователь (Заголовок 3) [заг секции]</Typography.Title>
    <Typography.Title level={4}>Пользователь (Заголовок 4) [заг колонки таблицы, заг таба, заг элемента, заг виджета]</Typography.Title>

    <Divider />

    <Typography.Text>Текстовая строка</Typography.Text>
    <br />
    <Typography.Text type="secondary">Текстовая строка (secondary)</Typography.Text>

    <Divider />

    <Typography.Caption>Подпись</Typography.Caption>
    <br />
    <Typography.Caption type="secondary">Подпись (secondary)</Typography.Caption>

    <Divider />

    <Typography.Link>Ссылка</Typography.Link>
    <br />
    <Typography.Link type="secondary">Ссылка (secondary)</Typography.Link>

    <Divider />
    <div style={{
      height: 30,
      borderRadius: 15,
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      justifyContent: 'center',
    }}
    >
      <Typography.Text style={{ color: 'white', textAlign: 'center' }}>
        Текстовая строка (переопределение цвета), только в случае кастомных элементов (например, название события)
      </Typography.Text>
    </div>

  </Card>
);

export default Account;
