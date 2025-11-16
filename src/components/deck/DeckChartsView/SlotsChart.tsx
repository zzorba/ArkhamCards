import React, { useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import { CartesianChart, Bar } from 'victory-native';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { useFont, Text } from '@shopify/react-native-skia';
import { t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import { SLOTS } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { ARKHAM_GLYPHS } from '@generated/arkhamGlyphs';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

export default function SlotIconChart({ parsedDeck: { slotCounts }, width }: Props) {
  const { typography, colors } = useContext(StyleContext);
  const barData = useMemo(() => {
    const filtered = filter(
      map(SLOTS, slot => ({
        slot: slot.replace(' ', '_'),
        slotOriginal: slot,
        value: slotCounts[slot] || 0,
      })),
      data => data.value > 0
    );
    // Reindex after filtering
    return filtered.map((item, index) => ({ ...item, index }));
  }, [slotCounts]);

  const font = useFont(require('../../../../assets/Alegreya-Regular.ttf'), 18);
  const labelFont = useFont(require('../../../../assets/Alegreya-Bold.ttf'), 14);
  const iconFont = useFont(require('../../../../assets/arkhamicons.ttf'), 24);

  if (!font || !labelFont || !iconFont) {
    return null;
  }

  return (
    <View style={[styles.wrapper, space.marginBottomL, { width }]}>
      <RNText style={[typography.large, typography.center]}>
        { t`Slots` }
      </RNText>
      <View style={{ height: 300 }}>
        <CartesianChart
          data={barData}
          xKey="index"
          yKeys={['value']}
          padding={{ left: 10, right: 10, top: 20, bottom: 40 }}
          domain={{ y: [0] }}
          xAxis={{
            font: iconFont,
            lineColor: 'transparent',
            labelColor: colors.darkText,
            formatXLabel: (index) => {
              const item = barData[index];
              if (item?.slot) {
                const glyphCode = ARKHAM_GLYPHS[item.slot];
                return glyphCode ? String.fromCharCode(glyphCode) : '';
              }
              return '';
            },
          }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
        >
          {({ points, chartBounds }) => (
            <>
              {points.value.map((point, index) => {
                const item = barData[point.xValue as number];
                return (
                  <React.Fragment key={index}>
                    <Bar
                      barCount={points.value.length}
                      points={[point]}
                      chartBounds={chartBounds}
                      color="#444"
                      roundedCorners={{ topLeft: 5, topRight: 5 }}
                    />
                    {item && item.value > 0 && (
                      <Text
                        x={point.x}
                        y={point.y as any - 5}
                        text={String(item.value)}
                        font={labelFont}
                        color={colors.darkText}
                      />
                    )}
                  </React.Fragment>
                );
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
    marginBottom: 64,
  },
});
