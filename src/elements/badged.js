import React from 'react';
import stylied from 'styled-components';

import Typography from 'elements/typography';

const Badged = stylied.div`
&:${({ align }) => (align === 'right' ? 'after' : 'before')} {
  content: " ";
  display: ${({ align }) => (align === 'right' ? 'inline-block' : 'block')};
  margin-left: ${({ align }) => (align === 'right' ? '8px' : '0px')};
  border-radius: ${({ size }) => size * 2}px;
  background-color: ${({ stateColor }) => stateColor};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  position: ${({ align }) => (align === 'right' ? 'inherit' : 'absolute')};
  top: ${({ size }) => `calc(50% - ${size / 2}px)`};
  left: 0px;
}
`;

const TypographedBadge = ({ children, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Badged {...props}><Typography.Text>{ children }</Typography.Text></Badged>
);

export default TypographedBadge;
