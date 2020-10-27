import stylied from 'styled-components';

const Badged = stylied.div`
&:${({ align }) => (align === 'right' ? 'after' : 'before')} {
  content: " ";
  display: ${({ align }) => (align === 'right' ? 'inline-block' : 'block')};
  margin-left: ${({ align }) => (align === 'right' ? '8px' : '0px')};
  border-radius: ${({ size }) => size}px;
  background-color: ${({ stateColor }) => stateColor};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  position: ${({ align }) => (align === 'right' ? 'inherit' : 'absolute')};
  top: ${({ size }) => `calc(50% - ${size / 2}px)`};
  left: 0px;
}
`;

export default Badged;
