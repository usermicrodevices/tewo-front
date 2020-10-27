import React from 'react';
import { Typography } from 'antd';
import PropTypes from 'prop-types';
import cx from 'classnames';

import style from './style.module.scss';

const { Text } = Typography;

const getClassNameBySize = (size) => {
  switch (size) {
    case 'xxxl': return style.xxxl;
    case 'xl': return style.xl;
    case 'l': return style.l;
    case 's': return style.s;
    default: return '';
  }
};

function Value({
  children, className, size, ...props
}) {
  const classes = cx([style.text, getClassNameBySize(size), className]);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Text className={classes} {...props}>{children}</Text>;
}

Value.propTypes = { size: PropTypes.oneOf(['xl', 'l', 'm', 's']), ...Text.propTypes };
Value.defaultProps = { size: 'm', ...Text.defaultProps };

export default Value;
