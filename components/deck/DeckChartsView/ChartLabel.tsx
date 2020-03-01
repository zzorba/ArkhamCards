import React from 'react';
import { VictoryLabel, VictoryLabelProps } from 'victory-native';

interface Props extends VictoryLabelProps {
  datum: any;
  field: string;
}

export default class ChartLabel extends React.Component<Props> {
  render() {
    const { datum, field } = this.props;
    if (datum[field] > 0) {
      if (datum[field] < 4) {
        return (
          <VictoryLabel
            {...this.props}
            // @ts-ignore TS2769
            style={{
              fill: '#222',
              fontSize: 14,
              fontFamily: 'System',
              fontWeight: '700',
            }}
            dy={0}
          />
        );
      }
      return (
        <VictoryLabel {...this.props} dy={20} />
      );
    }
    return null;
  }
}
