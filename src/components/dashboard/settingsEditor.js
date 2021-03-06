import React, { useState } from 'react';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';

import Selector from 'elements/filters/select';
import { SemanticRanges } from 'utils/date';
import Icon from 'elements/icon';
import { WIDGETS_ADDITIONAL_INFORMATION } from 'services/dashboard';

import style from './settingsEditor.module.scss';

const isHaveDateFilter = (key) => WIDGETS_ADDITIONAL_INFORMATION[key]?.isHaveDateFilter;

const isHavePointsFilter = (key) => WIDGETS_ADDITIONAL_INFORMATION[key]?.isHavePointsFilter;

const SettingsEditor = inject(({ grid, session }) => ({ grid, session }))(observer(({ grid, session }) => {
  const initialValues = {
    widgetType: undefined,
    dateFilter: undefined,
    salePontsFilter: [],
    companiesFilter: [],
  };
  if (!grid.isEdditingNewItem) {
    initialValues.widgetType = grid.items[grid.editingItem].get('widgetType');
    initialValues.dateFilter = grid.items[grid.editingItem].get('dateFilter');
    initialValues.salePontsFilter = grid.items[grid.editingItem].get('salePontsFilter');
    initialValues.companiesFilter = grid.items[grid.editingItem].get('companiesFilter');
  }

  const [widgetType, justSetType] = useState(initialValues.widgetType);
  const [dateFilter, setDate] = useState(initialValues.dateFilter);
  const [salePontsFilter, setPoints] = useState(initialValues.salePontsFilter || []);
  const [companiesFilter, setCompaniesValue] = useState(initialValues.companiesFilter || []);
  const typeInfo = WIDGETS_ADDITIONAL_INFORMATION[widgetType] || {
    defaultDateRange: null,
    excludedDateRandes: new Set([]),
  };
  const setType = (newType) => {
    const newTypeInfo = WIDGETS_ADDITIONAL_INFORMATION[newType];
    justSetType(newType);
    if (newTypeInfo.defaultDateRange !== null) {
      setDate(newTypeInfo.defaultDateRange);
    } else if (newTypeInfo.excludedDateRandes.has(dateFilter)) {
      const anyAllow = Object.keys(SemanticRanges)
        .find((k) => !newTypeInfo.excludedDateRandes.has(dateFilter));
      setDate(anyAllow);
    }
  };

  const title = grid.isEdditingNewItem
    ? '???????????????? ???????????? ??????????????'
    : `???????????????????????????? ?????????????? ${grid.widgetsInfo[initialValues.widgetType]?.title || ''}`;
  const commit = () => {
    grid.updateSettings({
      widgetType,
      dateFilter: isHaveDateFilter(widgetType) ? dateFilter || null : null,
      salePontsFilter: isHavePointsFilter(widgetType) ? salePontsFilter : null,
      companiesFilter: isHavePointsFilter(widgetType) ? companiesFilter : null,
    });
  };
  const isTypeSelectorDisabled = !grid.isWidgetsInfoLoaded || !grid.isEdditingNewItem;
  const dateSelector = Object.entries(SemanticRanges)
    .map(([key, { title: rangeTitle }]) => [key, rangeTitle])
    .filter(([key]) => !typeInfo.excludedDateRandes.has(key));
  const datePickerTitle = (
    <>
      <Icon name="calendar-outline" />
      &nbsp;
      ?????????? ??????????????
    </>
  );
  const pointsSelector = companiesFilter.length === 0 || !session.points.isLoaded
    ? session.points.selector
    : session.points.getByCompanyIdSet(new Set(companiesFilter)).map(({ id, name }) => [id, name]);

  const setCompanies = (v) => {
    setCompaniesValue(v);
    if (v.length === 0) {
      return;
    }
    const points = session.points.getByCompanyIdSet(new Set(v));
    if (!Array.isArray(points)) {
      return;
    }
    const available = new Set(points.map(({ id }) => id));
    const filtered = salePontsFilter.filter((id) => available.has(id));
    if (filtered.length !== salePontsFilter.length) {
      setPoints(filtered);
    }
  };
  return (
    <Modal
      className={style.root}
      visible
      title={title}
      onOk={commit}
      onCancel={() => { grid.cancelEditSettings(); }}
      okButtonProps={{ disabled: typeof widgetType === 'undefined' }}
    >
      <div className={style.type}>
        <div className={style.title}>?????????? ????????</div>
        <Selector title="?????? ??????????????" isSingle value={widgetType} onChange={setType} selector={grid.widgetTypeSelector} disabled={isTypeSelectorDisabled} />
      </div>
      <div className={style.filters}>
        <div className={style.title}>?????????? ????????????????</div>
        <Selector
          title={datePickerTitle}
          value={dateFilter}
          onChange={setDate}
          selector={dateSelector}
          disabled={!isHaveDateFilter(widgetType)}
          isSingle
          disallowClear={typeInfo.excludedDateRandes.has(null)}
        />
        <Selector
          title="????????????????"
          value={companiesFilter}
          onChange={setCompanies}
          selector={session.companies.selector}
          disabled={!isHavePointsFilter(widgetType)}
        />
        <Selector
          title="??????????????"
          value={salePontsFilter}
          onChange={setPoints}
          selector={pointsSelector}
          disabled={!isHavePointsFilter(widgetType)}
        />
        <Selector
          title="????????"
          disabled
          selector={[]}
        />
      </div>
    </Modal>
  );
}));

const Wrap = inject('grid')(observer(({ grid }) => {
  if (grid.isEdditing) {
    return <SettingsEditor />;
  }
  return null;
}));

export {
  Wrap as default,
  isHaveDateFilter,
};
