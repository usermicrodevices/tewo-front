import React, { useEffect, useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import classNames from 'classnames';

import SimpleTable from 'elements/table/simpleTable';

import classes from './style.module.scss';

const SelectableTable = ({
  columns, onSelect, dataSource, className, disabledText,
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
  useEffect(() => {
    const knownIds = new Set(dataSource?.map(({ key }) => key) || []);
    const filtered = new Set([...selected.values()].filter((key) => knownIds.has(key)));
    if (filtered.size !== selected.size) {
      setSelected(filtered);
      onSelect(filtered);
    }
  }, [dataSource]);

  return (
    <SimpleTable
      className={className}
      columns={{
        checkbox: {
          title: (
            <Tooltip title="Снять выбор">
              <Checkbox
                indeterminate={selected.size > 0}
                checked={selected.size === dataSource?.filter(({ disabled }) => !disabled).length}
                onChange={() => {
                  setSelected(new Set([]));
                  onSelect(selected);
                }}
              />
            </Tooltip>
          ),
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
