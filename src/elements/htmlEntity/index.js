import React from 'react';

function HTMLEntity({ code, ...rest }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <span {...rest} dangerouslySetInnerHTML={{ __html: code }} />;
}

export default HTMLEntity;
