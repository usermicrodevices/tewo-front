import React from 'react';
import styled from 'styled-components';

import { parseColor } from 'utils/color';

function textColorSelector(backgroundColor) {
  const [r, g, b] = parseColor(backgroundColor) || [255, 255, 255];
  if (r + g + b < 530) {
    return 'white';
  }
  return 'black';
}

function colorMultiplex(color, k, reward) {
  const operator = reward ? (c) => Math.max(255 - (255 - c) * k, 0) : (c) => Math.min(c * k, 255);
  const [r, g, b] = (parseColor(color) || [255, 255, 255]).map(operator);
  return `rgb(${r},${g},${b})`;
}

const Cell = styled.div`
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.color};
  border-radius: 14px;
  display: inline-block;
  padding: 2px 14px;
  margin-top: -2px;
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
`;

const ColorizedCell = ({ children, color: bgColor }) => {
  const color = textColorSelector(bgColor);
  const hoverBG = colorMultiplex(bgColor, 0.9, !!color) || '#fafafa';
  return (
    <Cell color={bgColor || '#fafafa'} textColor={color} hoverColor={hoverBG}>{children}</Cell>
  );
};

export default ColorizedCell;
