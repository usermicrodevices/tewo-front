/* eslint react/no-danger: "off" */
import React from 'react';
import { icons } from 'eva-icons';
import classNames from 'classnames';

import style from './style.module.scss';

const Icon = ({
  name,
  onClick,
  reflex,
  className,
  size,
}) => {
  const sizeStyle = size && { fontSize: size };
  const { contents: icon } = name in icons ? icons[name] : icons['slash-outline'];
  return (
    <span style={sizeStyle} role="img" aria-label="bar-chart" className="anticon anticon-bar-chart">
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        className={classNames(className, style.generic, { [style.reflex]: reflex })}
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    </span>
  );
};

export default Icon;
