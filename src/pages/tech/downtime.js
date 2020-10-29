import React from 'react';
import { inject, Provider, observer } from 'mobx-react';
import { Card } from 'antd';

import OverdueModel from 'models/events/overdue';
import { TableHeader } from 'pages/genericPage/headers';
import Format from 'elements/format';
import Table from 'elements/table';
import Barchart from 'elements/chart/barchart';
import Loader from 'elements/loader';

import classes from './downtime.module.scss';

const Values = inject('table')(observer(({ table }) => (
  <div className={classes.values}>
    <div>
      <div className={classes.value}><Format>{ table.amount }</Format></div>
      <div className={classes.label}>просроченные события</div>
    </div>
    <div>
      <div className={classes.value}><Format>{ table.downtime }</Format></div>
      <div className={classes.label}>суммарное время простоя</div>
    </div>
  </div>
)));

const Chart = inject('table')(observer(({ table }) => {
  if (typeof table.pointsDowntimes === 'undefined') {
    return <Loader />;
  }
  return (
    <Barchart
      height={345}
      x={table.pointsDowntimes.map(({ name }) => name).slice(0, 60)}
      y={table.pointsDowntimes.map(({ downtime }) => Math.round(downtime / 60)).slice(0, 60)}
      yAxis="Время простоя (минут)"
    />
  );
}));

@inject('session')
@observer
class Downtime extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      model: new OverdueModel(session),
    });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }
    return (
      <Provider table={model} filter={model.filter}>
        <TableHeader title="Время простоя оборудования" />
        <Card className={classes.chart}>
          <Values />
          <Chart />
        </Card>
        <Card className={classes.table}>
          <Table />
        </Card>
      </Provider>
    );
  }
}

export default Downtime;
