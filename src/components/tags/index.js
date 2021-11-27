import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tag as AntdTag } from 'antd';

import { randomColor } from 'utils/color';

const Tag = ({ session: { tags }, id }) => {
  const tag = tags.get(id);
  if (!tag) {
    return null;
  }
  return (
    <AntdTag
      color={randomColor(tag.name)}
      selector={tags.selector}
    >
      {tag.name}
    </AntdTag>
  );
};

export default inject('session')(observer(Tag));
