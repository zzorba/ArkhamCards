import React, { useContext, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { flatMap, forEach, map, range, shuffle } from 'lodash';
import { t } from 'ttag';

import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { CalendarEntry } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  campaignLog: GuidedCampaignLog;
  calendar: CalendarEntry[];
  time: number;
  width: number;
}

const SCALE_FACTOR = [1, 1, 0.95, 0.85, 0.75, 0.75]
const RANDOM_CHECKS = shuffle([
  'a','b','c','d','e','f',
  'a','b','c','d','e','f',
  'a','b','c','d','e','f',
  'a','b','c','d','e','f',
  'a','b','c','d','e','f',
  'a','b','c','d','e','f']);

function SymbolEntries({ entries, size }: { entries: string[]; size: number }) {
  const { typography } = useContext(StyleContext);
  const numEntries = entries.length;
  const symbolSize = (size / 2.25) * (SCALE_FACTOR[numEntries] || 1);
  return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text style={[typography.text, { fontSize: symbolSize, lineHeight: symbolSize, fontWeight: '900' }, typography.center]}>
        { entries.join(' ') }
      </Text>
    </View>
  );
}
export default function CampaignLogCalendarComponent({ calendar, campaignLog, time, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const size = (width - 6 * 2) / 7.0;
  const boxSize = size / 3.5;
  const calendarEntries = useMemo(() => {
    const result: { [key: string]: string[] | undefined; } = {};
    forEach(calendar, c => {
      if (c.time) {
        if (!result[c.time]) {
          result[c.time] = [];
        }
        result[c.time]?.push(c.symbol);
        return;
      }
      if (c.entry) {
        const count = campaignLog.count('hidden', c.entry);
        if (count) {
          if (!result[count]) {
            result[count] = [];
          }
          result[count]?.push(c.symbol);
        }
        return;
      }
    });
    return result;
  }, [calendar, campaignLog]);
  return (
    <View style={[styles.calendar, { width, borderColor: colors.D10, backgroundColor: colors.L20 }]}>
      <View style={[styles.calendarInset, { borderColor: colors.D20 }]}>
        <View style={{ width: size * 7 }}>
          <Text style={[typography.text, { fontSize: 48, lineHeight: 56, fontWeight: '900' }, typography.center, typography.uppercase, space.paddingVerticalS]}>
            {t`Time Passed`}
          </Text>
        </View>
        { flatMap(range(0, 5), row => map(range(0, 7), col => {
          const day = (row * 7) + col + 1;
          const entries = calendarEntries[day];
          return (
            <View key={row * 7 + col} style={{
              width: size,
              height: size,
              borderTopWidth: 1,
              borderLeftWidth: col !== 0 ? 1: 0,
              position: 'relative',
              flexDirection: 'column',
              borderColor: colors.D30,
            }} removeClippedSubviews={false}>
              <View style={[styles.headerRow, { position: 'relative' }]}>
                <View style={[styles.checkbox, {
                  width: boxSize,
                  height: boxSize,
                  borderColor: colors.D20,
                }]} />
                { time >= day && (
                  <View style={{ position: 'absolute', top: -boxSize * 0.1, left: -boxSize * 0.1 }}>
                    <AppIcon
                      name={`cross_${RANDOM_CHECKS[day - 1]}`}
                      size={boxSize * 1.2}
                      color={colors.campaign.text.resolution}
                    />
                  </View>
                ) }
                <View style={[styles.date, { marginRight: 3 }]}>
                  <Text style={typography.small}>{day}</Text>
                </View>
              </View>
              { !!entries?.length && (
                <SymbolEntries entries={entries} size={size} />
              )}
            </View>
          )
        })) }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  calendar: {
    borderWidth: 1,
    padding: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarInset: {
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkbox: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomRightRadius: 2,
  },
  check: {
    position: 'absolute',
    top: -2,
    left: -2,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
})
