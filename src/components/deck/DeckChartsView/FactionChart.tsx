import React, { useContext, useMemo } from 'react';
import { filter } from 'lodash';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { CartesianChart, StackedBar, Bar } from 'victory-native';
import { useFont, Text } from '@shopify/react-native-skia';
import { t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import { PLAYER_FACTION_CODES } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { ARKHAM_GLYPHS } from '@generated/arkhamGlyphs';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

export default function FactionChart({ parsedDeck, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const barData = useMemo(() => {
    const filtered = filter(
      PLAYER_FACTION_CODES.map((faction) => {
        const counts = parsedDeck.factionCounts[faction] || [0, 0];
        return {
          faction,
          dual: counts[0],
          count: counts[1],
          total: counts[0] + counts[1],
          factionColor: colors.faction[faction].background,
          dualColor: colors.faction.dual.background,
        };
      }),
      data => data.count > 0 || data.dual > 0
    );
    // Reindex after filtering
    return filtered.map((item, index) => ({ ...item, index }));
  }, [parsedDeck.factionCounts, colors]);

  const font = useFont(require('../../../../assets/Alegreya-Regular.ttf'), 18);
  const labelFont = useFont(require('../../../../assets/Alegreya-Bold.ttf'), 14);
  const iconFont = useFont(require('../../../../assets/arkhamicons.ttf'), 24);

  if (!font || !labelFont || !iconFont) {
    return null;
  }

  if (barData.length === 0) {
    return null;
  }

  return (
    <View style={[styles.wrapper, space.marginBottomL, { width }]}>
      <RNText style={[typography.large, typography.center]}>
        { t`Card Factions` }
      </RNText>
      <View style={{ height: 300 }}>
        <CartesianChart
          data={barData}
          xKey="index"
          yKeys={['dual', 'count']}
          padding={{ left: 10, right: 10, top: 40, bottom: 40 }}
          domain={{ y: [0] }}
          xAxis={{
            font: iconFont,
            lineColor: 'transparent',
            labelColor: colors.darkText,
            formatXLabel: (index) => {
              const item = barData[index];
              if (item?.faction) {
                const glyphCode = ARKHAM_GLYPHS[item.faction];
                return glyphCode ? String.fromCharCode(glyphCode) : '';
              }
              return '';
            },
          }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
        >
          {({ points, chartBounds }) => (
            <>
              {barData.map((item, index) => {
                const dualPoint = points.dual[index];
                const countPoint = points.count[index];

                // If only dual cards exist, render a single Bar
                if (item.count === 0) {
                  return (
                    <React.Fragment key={index}>
                      <Bar
                        barCount={barData.length}
                        points={[dualPoint]}
                        chartBounds={chartBounds}
                        color={item.dualColor}
                        roundedCorners={{ topLeft: 5, topRight: 5 }}
                      />
                      {item.dual > 0 && (
                        <Text
                          x={dualPoint.x}
                          y={dualPoint.y as any - 5}
                          text={String(item.dual)}
                          font={labelFont}
                          color={colors.darkText}
                        />
                      )}
                    </React.Fragment>
                  );
                }

                // If only single faction cards exist, render a single Bar
                if (item.dual === 0) {
                  return (
                    <React.Fragment key={index}>
                      <Bar
                        barCount={barData.length}
                        points={[countPoint]}
                        chartBounds={chartBounds}
                        color={item.factionColor}
                        roundedCorners={{ topLeft: 5, topRight: 5 }}
                      />
                      {item.count > 0 && (
                        <Text
                          x={countPoint.x}
                          y={countPoint.y as any - 5}
                          text={String(item.count)}
                          font={labelFont}
                          color={colors.darkText}
                        />
                      )}
                    </React.Fragment>
                  );
                }

                // Both exist, render StackedBar with manual labels
                // Calculate the boundary between dual and count segments
                const chartBottom = chartBounds.bottom;
                const totalHeight = chartBottom - (countPoint.y as number);
                const dualHeight = (item.dual / item.total) * totalHeight;
                const dualSegmentTop = chartBottom - dualHeight;
                const dualLabelY = (chartBottom + dualSegmentTop) / 2 - 8;

                return (
                  <React.Fragment key={index}>
                    <StackedBar
                      barCount={barData.length}
                      points={[[dualPoint], [countPoint]]}
                      chartBounds={chartBounds}
                      // eslint-disable-next-line react/jsx-no-bind
                      barOptions={({ isTop }) => ({
                        roundedCorners: isTop ? { topLeft: 5, topRight: 5 } : undefined,
                        color: isTop ? item.factionColor : item.dualColor,
                      })}
                    />
                    {/* Label for total at top of entire bar */}
                    <Text
                      x={countPoint.x}
                      y={(countPoint.y as number) - 14}
                      text={String(item.total)}
                      font={labelFont}
                      color={colors.darkText}
                    />
                    {/* Label for dual (bottom segment) - white text centered in segment */}
                    {item.dual > 0 && (
                      <Text
                        x={dualPoint.x}
                        y={dualLabelY}
                        text={String(item.dual)}
                        font={labelFont}
                        color="white"
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
