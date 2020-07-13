import React from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';

const Layout = WidthProvider(GridLayout);

const Grid = ({ children, layout }) => (
  <Layout layout={layout} cols={2} draggableCancel="*">
    {children}
  </Layout>
);

export default Grid;
