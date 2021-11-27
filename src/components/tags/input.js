import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tag, Button } from 'antd';

import { randomColor } from 'utils/color';
import Loader from 'elements/loader';

import TagsInputButton from './inputButton';
import cn from './input.module.scss';

const TagsInput = ({
  session: { tags }, onChange, value,
}, ref) => {
  if (tags.selector === undefined) {
    return <Loader />;
  }

  const toggle = (id) => () => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className={cn.tags} ref={ref}>
      {
        tags.selector.map(([id, name]) => (
          <Button key={id} size="small" type="text" onClick={toggle(id)}>
            <Tag color={randomColor(name, value.includes(id) ? 1 : 0.6)}>{name}</Tag>
          </Button>
        ))
      }
      <TagsInputButton onCreate={(id) => toggle(id)()} />
    </div>
  );
};

export default inject('session')(observer(React.forwardRef(TagsInput)));
