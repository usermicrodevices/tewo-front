import stylied from 'styled-components';

const Badge = stylied.div`
&:before {
  content: " ";
  display: block;
  border-radius: 8px;
  background-color: ${({ stateColor }) => stateColor};
  width: 8px;
  height: 8px;
  position: absolute;
  top: calc(50% - 4px);
  left: 0px;
}
`;

export default Badge;
