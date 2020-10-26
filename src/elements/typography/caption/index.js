import React from 'react';
import { Typography } from 'antd';

import classnames from './index.module.scss';

const { Text } = Typography;

function Caption({ children, ...props }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Text className={classnames.root} {...props}>{children}</Text>;
}

Caption.propTypes = Text.propTypes;
Caption.defaultProps = Text.defaultProps;

export default Caption;
