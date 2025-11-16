import React, { useContext, useMemo } from 'react';
import { map } from 'lodash';
import { CartesianChart, Bar } from 'victory-native';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { useFont, Text } from '@shopify/react-native-skia';
import { t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import { SKILLS } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { ARKHAM_GLYPHS } from '@generated/arkhamGlyphs';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

export default function SkillIconChart({ width, parsedDeck }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const barData = useMemo(() => {
    const result = map(SKILLS, (skill, index) => {
      return {
        index,
        skill,
        value: parsedDeck.skillIconCounts[skill] || 0,
      };
    });
    return result;
  }, [parsedDeck.skillIconCounts]);

  const font = useFont(require('../../../../assets/Alegreya-Regular.ttf'), 18);
  const labelFont = useFont(require('../../../../assets/Alegreya-Bold.ttf'), 14);
  const iconFont = useFont(require('../../../../assets/arkhamicons.ttf'), 24);

  if (!font || !labelFont || !iconFont) {
    return null;
  }

  return (
    <View style={[styles.wrapper, space.marginBottomL, { width }]}>
      <RNText style={[typography.large, typography.center]}>
        { t`Skill Icons` }
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
              if (item?.skill) {
                const glyphCode = ARKHAM_GLYPHS[item.skill];
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
                const skill = barData[point.xValue as number]?.skill;
                const barColor = skill ? colors.skill[skill]?.icon || '#444' : '#444';
                const item = barData[point.xValue as number];
                return (
                  <React.Fragment key={index}>
                    <Bar
                      barCount={points.value.length}
                      points={[point]}
                      chartBounds={chartBounds}
                      color={barColor}
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
