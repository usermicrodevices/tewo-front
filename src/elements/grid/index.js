import React from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';

import style from './style.module.scss';

const Layout = WidthProvider(GridLayout);

const Grid = ({ children, layout }) => (
  <div className={style.wrapper}>
    <Layout layout={layout} cols={2} draggableCancel="*" margin={[24, 24]}>
      {children}
    </Layout>
  </div>
);

export default Grid;
