import React, { useMemo, useContext } from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { useFont, Text } from '@shopify/react-native-skia';
import { t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item extends Record<string, unknown> {
  index: number;
  costLabel: string;
  value: number;
}

export default function CostChart({ parsedDeck: { costHistogram }, width }: Props) {
  const { typography, colors } = useContext(StyleContext);
  const barData = useMemo(() => {
    return costHistogram.map((item, index): Item => ({
      index,
      costLabel: item.cost,
      value: item.count,
    }));
  }, [costHistogram]);

  const font = useFont(require('../../../../assets/Alegreya-Regular.ttf'), 18);
  const labelFont = useFont(require('../../../../assets/Alegreya-Bold.ttf'), 14);

  if (!font || !labelFont) {
    return null;
  }

  return (
    <View style={[styles.wrapper, space.marginBottomL, { width }]}>
      <RNText style={[typography.large, typography.center]}>
        { t`Card Costs` }
      </RNText>
      <View style={{ height: 300 }}>
        <CartesianChart
          data={barData}
          xKey="index"
          yKeys={['value']}
          padding={{ left: 10, right: 10, top: 20, bottom: 40 }}
          domain={{ y: [0] }}
          xAxis={{
            font,
            labelColor: colors.darkText,
            lineColor: 'transparent',
            formatXLabel: (index) => {
              const item = barData[index];
              return item?.costLabel || '';
            },
          }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
        >
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points.value}
                chartBounds={chartBounds}
                color="#444"
                roundedCorners={{ topLeft: 5, topRight: 5 }}
              />
              {points.value.map((point, index) => {
                const item = barData[index];
                if (item && item.value > 0) {
                  return (
                    <Text
                      key={index}
                      x={point.x}
                      y={point.y as any - 5}
                      text={String(item.value)}
                      font={labelFont}
                      color={colors.darkText}
                    />
                  );
                }
                return null;
              })}
            </>
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
