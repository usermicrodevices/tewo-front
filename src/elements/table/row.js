import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { parseColor } from 'utils/color';
import Loader from 'elements/loader';
import Cup from 'elements/cup';
import classNames from 'classnames';
import styles from './style.module.scss';

const ACTIONS_COLUMN_WIDT = 100;
const SCROLL_PANE_WIDTH = 25;

function textColorSelector(backgroundColor) {
  const [r, g, b] = parseColor(backgroundColor) || [255, 255, 255];
  if (Math.max(r, g, b) < 150 || Math.min(r, g, b) <= 80) {
    return 'white';
  }
  return null;
}

function colorMultiplex(color, k, reward) {
  const operator = reward ? (c) => Math.max(255 - (255 - c) * k, 0) : (c) => Math.min(c * k, 255);
  const [r, g, b] = (parseColor(color) || [255, 255, 255]).map(operator);
  return `rgb(${r},${g},${b})`;
}

const Row = styled.div`
  background-color: ${(props) => props.color};
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
`;

const Cell = (data, columns, freshItems, rowFunc, columnWidth, actions) => observer(({ index: rowIndex, style }) => {
  const index = rowFunc(rowIndex);
  const rowData = data[index];
  if (typeof rowData === 'undefined') {
    return <div style={style}><Loader /></div>;
  }
  const color = textColorSelector(rowData.rowBackgroundColor);
  const finalStyle = rowData.rowBackgroundColor
    ? {
      color,
      ...style,
    }
    : style;
  const hoverBG = colorMultiplex(rowData.rowBackgroundColor, 0.9, !!color) || '#fafafa';
  return (
    <Row
      color={rowData.rowBackgroundColor || 'transparent'}
      hoverColor={hoverBG}
      style={finalStyle}
      className={classNames(
        styles.row,
        {
          [styles.highlightnew]: freshItems.has(rowIndex),
        },
      )}
    >
      {
        columns.map(({ align, key, transform }, columnIndex) => {
          let datum = rowData[key];
          if (transform) {
            datum = transform(datum, rowData);
          }
          if (typeof datum === 'undefined') {
            datum = <Loader />;
          }
          if (datum === null) {
            datum = '—';
          }
          const cellStyle = { textAlign: align || 'left', width: columnWidth[columnIndex] };
          return (
            <div
              key={key}
              style={cellStyle}
              className={styles['virtual-table-cell']}
            >
              { datum }
            </div>
          );
        })
      }
      { actions.isVisible && (
        <div
          style={{ width: ACTIONS_COLUMN_WIDT - SCROLL_PANE_WIDTH }}
          className={classNames(styles['virtual-table-cell'], styles.lastcolumn)}
        >
          { actions.isFormulaEditable && actions.isFormulaEditable(rowData, index) && (
            <Button type="link" onClick={() => { actions.onFillFormula(rowData); }} icon={<Cup isFilled={actions.isHaveFormula(rowData, index)} />} />
          )}
          { actions.isEditable(rowData, index) && (
            <Button type="link" onClick={() => { actions.onEdit(rowData); }} icon={<EditOutlined />} />
          )}
        </div>
      )}
    </Row>
  );
});

export { Cell as default, ACTIONS_COLUMN_WIDT, SCROLL_PANE_WIDTH };
