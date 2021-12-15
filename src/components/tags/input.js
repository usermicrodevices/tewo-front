import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Tag, Button, Select } from 'antd';

import { randomColor } from 'utils/color';
import Loader from 'elements/loader';

import TagsInputButton from './inputButton';
import cn from './input.module.scss';

const TagsInput = ({
  session: { tags }, onChange, value,
}, ref) => {
  const valueSet = new Set(value);

  const onClose = (id) => () => {
    onChange(value.filter((v) => v !== id));
  };

  const onSelect = useCallback((selected) => {
    onChange([...value, selected]);
  }, [value, onChange]);
  console.log('value', value);

  if (tags.selector === undefined) {
    return <Loader />;
  }

  const options = tags.selector.filter(([id]) => !valueSet.has(id));

  return (
    <div className={cn.tags} ref={ref}>
      {
        tags.selector.filter(([id]) => valueSet.has(id)).map(([id, name]) => (
          <Tag key={id} color={randomColor(name)} closable onClose={onClose(id)}>{name}</Tag>
        ))
      }
      { options.length > 0 && (
        <Select
          showSearch
          value={null}
          style={{ width: 200 }}
          size="small"
          placeholder="Выберите тег"
          optionFilterProp="children"
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
          onChange={onSelect}
        >
          {
            options.map(([id, text]) => <Select.Option value={id} key={id}>{text}</Select.Option>)
          }
        </Select>
      )}
      <TagsInputButton onCreate={(id) => onSelect(id)()} />
    </div>
  );
};

export default inject('session')(observer(React.forwardRef(TagsInput)));
