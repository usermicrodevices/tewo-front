import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tag as AntdTag } from 'antd';
import Format from 'elements/format';

import { randomColor } from 'utils/color';

const Tag = ({ session: { tags }, id, width }) => {
  const tag = tags.get(id);
  if (!tag) {
    return null;
  }
  return (
    <AntdTag
      color={randomColor(tag.name)}
      selector={tags.selector}
    >
      <Format width={width}>{tag.name}</Format>
    </AntdTag>
  );
};

export default inject('session')(observer(Tag));
