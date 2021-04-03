import React from 'react';

import { Item, ELEMNT_MINIMUM_WIDTH } from './item';
import classes from './row.module.scss';

const Row = (width, itemsCount) => {
  const elementsInRow = Math.max(1, Math.floor(width / ELEMNT_MINIMUM_WIDTH));
  const rowsCount = Math.ceil(itemsCount / elementsInRow);
  return {
    renderer: ({ index, style }) => (
      <div style={style} className={classes.row}>
        {
          new Array(elementsInRow).fill(null).map((_, id) => (
            // eslint-disable-next-line
            <Item width={width / elementsInRow} id={id + index * elementsInRow} key={id} />
          ))
        }
      </div>
    ),
    rowsCount,
  };
};

export default Row;
