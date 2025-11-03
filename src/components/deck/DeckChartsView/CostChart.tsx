import React, { useMemo, useContext } from 'react';
import { filter, map } from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item extends Record<string, unknown> {
  cost: number;
  costLabel: string;
  value: number;
  alwaysShow: boolean;
}

function specialCost(index: number) {
  if (index === -2) {
    return 'X';
  }
  if (index === -1) {
    return '-';
  }
  return `${index}`;
}

function getCostData(index: number, costHistogram: number[]): Item {
  const cost = index - 2;
  return {
    cost: cost,
    costLabel: specialCost(cost),
    alwaysShow: cost >= 0 && cost < 5,
    value: costHistogram[index] || 0,
  };
}

export default function CostChart({ parsedDeck: { costHistogram }, width }: Props) {
  const { typography, colors } = useContext(StyleContext);
  const barData = useMemo(() => {
    const result = filter(
      map(costHistogram, (_, idx) => getCostData(idx, costHistogram)),
      item => item.alwaysShow || item.value > 0
    );
    return result;
  }, [costHistogram]);

  const font = useFont(require('../../../../assets/Alegreya-Regular.ttf'), 18);
  const labelFont = useFont(require('../../../../assets/Alegreya-Bold.ttf'), 14);

  if (!font || !labelFont) {
    return null;
  }

  return (
    <View style={[styles.wrapper, space.marginBottomL, { width }]}>
      <Text style={[typography.large, typography.center]}>
        { t`Card Costs` }
      </Text>
      <View style={{ height: 300 }}>
        <CartesianChart
          data={barData}
          xKey="cost"
          yKeys={['value']}
          padding={{ left: 10, right: 10, top: 20, bottom: 40 }}
          domain={{ y: [0] }}
          xAxis={{
            font,
            labelColor: colors.darkText,
            lineColor: 'transparent',
          }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.value}
              chartBounds={chartBounds}
              color="#444"
              roundedCorners={{ topLeft: 5, topRight: 5 }}
              labels={{
                position: 'top',
                font: labelFont,
                color: 'white',
              }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    position: 'relative',
  },
});
