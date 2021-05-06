import React, { useState } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames';

import SimpleTable from 'elements/table/simpleTable';

import classes from './style.module.scss';

const SelectableTable = ({
  columns, onSelect, dataSource, className,
}) => {
  const [selected, setSelected] = useState(new Set());
  const onSelectRow = (id, disabled) => (disabled ? () => {} : ({ target: { checked: value } }) => {
    selected[value ? 'add' : 'delete'](id);
    setSelected(new Set([...selected.values()]));
    onSelect(selected);
  });
  const ds = dataSource?.map((datum) => ({
    ...datum,
    className: classNames(datum.className, { [classes.selected]: selected.has(datum.key) }),
    checkbox: {
      isPicked: selected.has(datum.key),
      setPicked: onSelectRow(datum.key, datum.disabled),
      disabled: datum.disabled || false,
    },
  }));

  return (
    <SimpleTable
      className={className}
      columns={{
        checkbox: {
          title: '',
          width: 50,
          align: 'center',
          transform: ({ isPicked, setPicked, disabled }) => <Checkbox disabled={disabled} defaultChecked={isPicked} onChange={setPicked} />,
        },
        ...columns,
      }}
      dataSource={ds}
    />
  );
};

export default SelectableTable;
