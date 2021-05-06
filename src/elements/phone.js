import React from 'react';

const HumanizedPhone = ({ children: n }) => {
  if (typeof n !== 'string') {
    return typeof n;
  }
  return `${n.slice(0, 1)} ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7, 9)} ${n.slice(9)}`;
};

const PhoneLink = ({ children: number }) => {
  const href = `tel:${number}`;
  return <a href={href}><HumanizedPhone>{number}</HumanizedPhone></a>;
};

export { HumanizedPhone };
export default PhoneLink;
