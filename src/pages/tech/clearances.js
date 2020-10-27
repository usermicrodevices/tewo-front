import React from 'react';
import { Card as AntdCard } from 'antd';
import { inject, Provider, observer } from 'mobx-react';

import ClearancesModel from 'models/events/clearances';
import { TableHeader } from 'pages/genericPage/headers';
import Table from 'elements/table';
import Card from 'elements/card';
import GenericCalendar from 'elements/calendar';
import colors from 'themes/calendar';
import Badge from 'elements/badged';
import Icon from 'elements/icon';
import Format from 'elements/format';

import classes from './clearances.module.scss';

const Calendar = inject('table')(observer(({ table }) => {
  const { calendar } = table;
  return (
    <AntdCard>
      <div className={classes.legend}>
        <Badge size={11} align="right" stateColor={colors.beverages}>Наливы</Badge>
        <Badge size={11} align="right" stateColor={colors.clearance}>Очистки</Badge>
      </div>
      <GenericCalendar
        clearances={calendar.clearance}
        beverages={calendar.beverages}
        onPanelChange={(moment) => calendar.setMonth(moment)}
        isLoading={calendar.isLoading}
      />
    </AntdCard>
  );
}));

const Stats = inject('table')(observer(({ table }) => {
  let { detergent } = table.stats;
  let ext = 'мл';
  if (detergent > 1e5) {
    ext = 'л';
    detergent /= 1e3;
  }
  return (
    <AntdCard className={classes.stats}>
      <div className={classes.title}>
        <Icon size={18} name="bar-chart-outline" />
        Сводная информация
      </div>
      <div>
        <div><span className={classes.value}><Format>{ table.isLoaded ? table.rawData.length : undefined }</Format></span></div>
        <div className={classes.label}>очисток за период</div>
      </div>
      <div>
        <div><span className={classes.value}><Format>{ table.stats.tablets }</Format></span></div>
        <div className={classes.label}>потрачено таблеток</div>
      </div>
      <div>
        <div>
          <span className={classes.value}><Format>{ detergent }</Format></span>
          { detergent && <span className={classes.label}>{ext}</span> }
        </div>
        <div className={classes.label}>потрачено жидкости</div>
      </div>
    </AntdCard>
  );
}));

@inject('session')
@observer
class Clearances extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      model: new ClearancesModel(session),
    });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }
    return (
      <Provider table={model} filter={model.filter}>
        <TableHeader title="История очисток" />
        <div className={classes.grid}>
          <Calendar />
          <Stats />
          <Card>
            <Table />
          </Card>
        </div>
      </Provider>
    );
  }
}

export default Clearances;
