import React from 'react';
import { Typography } from 'antd';
import cx from 'classnames';

import style from './style.module.scss';

const { Text } = Typography;

function Caption({ children, className, ...props }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Text className={cx(style.root, className)} {...props}>{children}</Text>;
}

Caption.propTypes = Text.propTypes;
Caption.defaultProps = Text.defaultProps;

export default Caption;
