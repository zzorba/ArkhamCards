import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';
import { VictoryLabel, VictoryLabelProps } from 'victory-native';

interface Props extends VictoryLabelProps {
  datum: any;
  field: string;
}

export default function ChartLabel({ datum, field, ...props }: Props){
  const { typography, colors } = useContext(StyleContext);
  if (datum[field] > 0) {
    if (datum[field] < 4) {
      return (
        <VictoryLabel
          datum={datum}
          {...props}
          // @ts-ignore TS2769
          style={{
            fill: colors.darkText,
            fontSize: 18,
            fontFamily: typography.bold.fontFamily,
            fontWeight: '700',
          }}
          dy={0}
        />
      );
    }
    return (
      <VictoryLabel datum={datum} {...props} dy={20} />
    );
  }
  return null;
}
