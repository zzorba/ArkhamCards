import React, { useCallback, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { msgid, ngettext, t } from 'ttag';

import { ParsedDeck } from '@actions/types';
import AppIcon from '@icons/AppIcon';
import DeckProblemRow from '@components/core/DeckProblemRow';
import { TINY_PHONE } from '@styles/sizes';
import COLORS from '@styles/colors';
import { showCardCharts, showDrawSimulator } from '@components/nav/helper';
import { FOOTER_HEIGHT } from './constants';
import { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

const SHOW_CHARTS_BUTTON = true;

interface Props {
  componentId: string;
  parsedDeck: ParsedDeck;
  xpAdjustment: number;
  controls?: React.ReactNode;
}

export default function DeckNavFooter({
  componentId,
  parsedDeck,
  xpAdjustment,
  controls,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const showCardChartsPressed = useCallback(() => {
    showCardCharts(componentId, parsedDeck, colors);
  }, [componentId, parsedDeck, colors]);

  const showDrawSimulatorPressed = useCallback(() => {
    showDrawSimulator(componentId, parsedDeck, colors);
  }, [componentId, parsedDeck, colors]);

  const problemRow = useMemo(() => {
    if (!parsedDeck.problem) {
      return null;
    }
    return (
      <DeckProblemRow
        problem={parsedDeck.problem}
        color="#FFFFFF"
        noFontScaling
      />
    );
  }, [parsedDeck.problem]);

  const xpString = useMemo(() => {
    const experience = parsedDeck.experience;
    const xp = parsedDeck.deck.xp;
    const changes = parsedDeck.changes;
    if (!changes) {
      return t`XP: ${experience}`;
    }
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    return t`XP: ${changes.spentXp} of ${adjustedExperience}`;
  }, [xpAdjustment, parsedDeck.changes, parsedDeck.experience, parsedDeck.deck.xp]);

  const {
    investigator,
    normalCardCount,
    totalCardCount,
  } = parsedDeck;
  const cardCountString = ngettext(
    msgid`${normalCardCount} Card (${totalCardCount} Total)`,
    `${normalCardCount} Cards (${totalCardCount} Total)`,
    normalCardCount
  );
  return (
    <View style={styles.borderWrapper}>
      <View style={[styles.wrapper, { backgroundColor: colors.faction[investigator.factionCode()].darkBackground }]}>
        <View style={styles.left}>
          <View style={styles.row}>
            <Text style={[
              TINY_PHONE ? typography.small : typography.text,
              styles.whiteText,
            ]} allowFontScaling={false}>
              { `${cardCountString} - ${xpString}` }
            </Text>
          </View>
          <View style={styles.row}>
            { problemRow }
          </View>
        </View>
        <View style={styles.right}>
          { controls || (
            <>
              { SHOW_CHARTS_BUTTON && (
                <TouchableOpacity onPress={showCardChartsPressed}>
                  <View style={styles.button}>
                    <MaterialCommunityIcons name="chart-bar" size={28} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              ) }
              <TouchableOpacity onPress={showDrawSimulatorPressed}>
                <View style={styles.button}>
                  <AppIcon name="cards-1" size={28} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </>
          ) }
        </View>
      </View>
    </View>
  );
}

const BUTTON_SIZE = 44;
const styles = StyleSheet.create({
  borderWrapper: {
    width: '100%',
    height: FOOTER_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.white,
  },
  wrapper: {
    width: '100%',
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: s,
    paddingLeft: m,
    paddingRight: s,
  },
  left: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  button: {
    padding: xs,
    width: BUTTON_SIZE,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
