import React, { useEffect, useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import classNames from 'classnames';

import SimpleTable from 'elements/table/simpleTable';

import classes from './style.module.scss';

const SelectableTable = ({
  columns, onSelect, dataSource, className, disabledText, value: externalValue,
}) => {
  const internalValue = useState(new Set());
  const [selected, setSelected] = externalValue ? [externalValue, () => {}] : internalValue;
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
  useEffect(() => {
    const knownIds = new Set(dataSource?.map(({ key }) => key) || []);
    const filtered = new Set([...selected.values()].filter((key) => knownIds.has(key)));
    if (filtered.size !== selected.size) {
      setSelected(filtered);
      onSelect(filtered);
    }
  }, [dataSource, onSelect, selected, setSelected]);
  return (
    <SimpleTable
      className={className}
      columns={{
        checkbox: {
          title: '',
          width: 50,
          align: 'center',
          transform: ({ isPicked, setPicked, disabled }) => (
            <Tooltip title={disabled ? disabledText : undefined}>
              <Checkbox
                disabled={disabled}
                defaultChecked={isPicked}
                onChange={setPicked}
              />
            </Tooltip>
          ),
        },
        ...columns,
      }}
      dataSource={ds}
    />
  );
};

export default SelectableTable;
