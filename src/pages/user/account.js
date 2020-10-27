import React from 'react';
import { Card, Divider } from 'antd';

import Typography from 'elements/typography';

const Account = () => (
  <Card title="Личный кабинет">
    <Typography.Title level={1}>Typography.Title (level: 1) [заг страницы]</Typography.Title>
    <Typography.Title level={2}>Typography.Title (level: 2) [заг модалки]</Typography.Title>
    <Typography.Title level={3}>Typography.Title (level: 3) [заг секции]</Typography.Title>
    <Typography.Title level={4}>Typography.Title (level: 4) [заг колонки таблицы, заг таба, заг элемента, заг виджета]</Typography.Title>

    <Divider />

    <Typography.Text>Typography.Text</Typography.Text>
    <br />
    <Typography.Text type="secondary">Typography.Text (type: secondary)</Typography.Text>

    <Divider />

    <Typography.Value size="s">Typography.Value (size: s)</Typography.Value>
    <br />
    <Typography.Value size="m">Typography.Value (size: m)</Typography.Value>
    <br />
    <Typography.Value size="l">Typography.Value (size: l)</Typography.Value>
    <br />
    <Typography.Value size="xl">Typography.Value (size: xl)</Typography.Value>
    <br />
    <Typography.Value size="xl" strong>Typography.Value (size: xl, strong: true)</Typography.Value>

    <Divider />

    <Typography.Caption>Typography.Caption</Typography.Caption>
    <br />
    <Typography.Caption type="secondary">Typography.Caption (type: secondary)</Typography.Caption>

    <Divider />

    <Typography.Link>Typography.Link</Typography.Link>
    <br />
    <Typography.Link type="secondary">Typography.Link (type: secondary)</Typography.Link>

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
