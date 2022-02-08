/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tag } from 'antd';

import { randomColor } from 'utils/color';
import Select from 'elements/filters/select';

function tagRender(props) {
  const {
    label, closable, onClose,
  } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return label && (
    <Tag
      color={randomColor(label)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}

const TagsSelect = ({ session: { tags }, ...props }) => (
  <Select
    {...props}
    tagRender={tagRender}
    selector={tags.selector}
  />
);

export default inject('session')(observer(TagsSelect));
