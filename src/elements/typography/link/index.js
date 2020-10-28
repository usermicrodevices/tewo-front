import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

function CustomLink({ children, to, ...props }) {
  if (to) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Link to={to} component={Typography.Link} {...props}>{children}</Link>;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Typography.Link {...props}>{children}</Typography.Link>;
}

CustomLink.propTypes = Text.propTypes;
CustomLink.defaultProps = Text.defaultProps;

export default CustomLink;
