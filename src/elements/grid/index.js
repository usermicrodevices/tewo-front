import React from 'react';
import { inject, observer } from 'mobx-react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';

import style from './style.module.scss';

const Grid = ({ children, layout, size }) => (
  <div className={style.wrapper}>
    <GridLayout width={size.width} layout={layout} cols={2} margin={[24, 24]}>
      {children}
      <div>{size}</div>
    </GridLayout>
  </div>
);

export default withSize()(Grid);
