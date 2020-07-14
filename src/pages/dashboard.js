import React from 'react';
import { Card } from 'antd';

import Grid from 'components/grid';

const GRID_LAYOUT_STORAGE_KEY = 'gridLayout';

const defaultLayout = [
  {
    i: 'a', x: 0, y: 0, w: 1, h: 1, static: true,
  },
  {
    i: 'b', x: 1, y: 0, w: 1, h: 2, minH: 1, maxH: 4,
  },
  {
    i: 'c', x: 0, y: 2, w: 1, h: 1,
  },
  {
    i: 'd', x: 0, y: 2, w: 2, h: 1,
  },
];

const Dashboard = () => {
  const layout = localStorage.getItem(GRID_LAYOUT_STORAGE_KEY) || defaultLayout;
  return (
    <Grid layout={layout}>
      <Card key="a" title="Card1 title">
        Card1 content
      </Card>
      <Card key="b" title="Card2 title">
        Card2 content
      </Card>
      <Card key="c" title="Card3 title">
        Card3 content
      </Card>
      <div key="d" style={{ backgroundColor: 'red' }}>jsut div</div>
    </Grid>
  );
};

export default Dashboard;
