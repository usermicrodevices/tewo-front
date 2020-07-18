import React from 'react';

const HumanizedPhone = ({ children: n }) => {
  if (typeof n !== 'string') {
    return typeof n;
  }
  return `${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8, 10)} ${n.slice(10)}`;
};

const PhoneLink = ({ children: number }) => {
  const href = `tel:${number}`;
  return <a href={href}><HumanizedPhone>{number}</HumanizedPhone></a>;
};

export { HumanizedPhone };
export default PhoneLink;
