import React, { useCallback, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { msgid, ngettext } from 'ttag';

import AppIcon from '@icons/AppIcon';
import DeckProblemRow from '@components/core/DeckProblemRow';
import { TINY_PHONE } from '@styles/sizes';
import COLORS from '@styles/colors';
import { showCardCharts, showDrawSimulator } from '@components/nav/helper';
import { FOOTER_HEIGHT } from './constants';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeckXpStrings, useParsedDeck } from '@components/deck/hooks';
import { FactionCodeType } from '@app_constants';

interface Props {
  componentId: string;
  deckId: number;
  controls?: React.ReactNode;
  faction?: FactionCodeType;
}

export default function DeckNavFooter({
  componentId,
  deckId,
  controls,
  faction,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const { parsedDeck } = useParsedDeck(deckId, 'NavFooter', componentId);

  const showCardChartsPressed = useCallback(() => {
    if (parsedDeck) {
      showCardCharts(componentId, parsedDeck, colors);
    }
  }, [componentId, parsedDeck, colors]);

  const showDrawSimulatorPressed = useCallback(() => {
    if (parsedDeck) {
      showDrawSimulator(componentId, parsedDeck, colors);
    }
  }, [componentId, parsedDeck, colors]);

  const problemRow = useMemo(() => {
    if (!parsedDeck?.problem) {
      return null;
    }
    return (
      <DeckProblemRow
        problem={parsedDeck.problem}
        color="#FFFFFF"
        noFontScaling
      />
    );
  }, [parsedDeck?.problem]);

  const factionColor = faction || parsedDeck?.investigator.factionCode();
  const bigTextStyle = TINY_PHONE ? typography.small : typography.text;
  const mainLine = useMemo(() => {
    if (!parsedDeck) {
      return null;
    }
    const {
      normalCardCount,
      totalCardCount,
    } = parsedDeck;
    const cardCountString = ngettext(
      msgid`${normalCardCount} Card`,
      `${normalCardCount} Cards`,
      normalCardCount
    );
    const totalCountString = ngettext(
      msgid`${totalCardCount} Total`,
      `${totalCardCount} Total`,
      totalCardCount
    );

    return (
      <View style={styles.row}>
        <Text style={[bigTextStyle, styles.whiteText]} allowFontScaling={false}>
          { `${cardCountString}` }
        </Text>
        <Text style={[typography.small, typography.italic, { lineHeight: bigTextStyle.lineHeight, color: '#ddd' }]} allowFontScaling={false}>
          { `  ${totalCountString}` }
        </Text>
      </View>
    );
  }, [parsedDeck, bigTextStyle, typography]);

  const [xpString, xpDetailString] = useDeckXpStrings(parsedDeck);

  const xpLine = useMemo(() => {
    if (!xpString && !xpDetailString) {
      return null;
    }
    return (
      <View style={styles.row}>
        { !!xpString && (
          <Text style={[bigTextStyle, styles.whiteText]} allowFontScaling={false}>
            { `  ·  ${xpString}` }
          </Text>
        ) }
        { !!xpDetailString && (
          <Text style={[typography.small, typography.italic, { lineHeight: bigTextStyle.lineHeight, color: '#ddd' }]} allowFontScaling={false}>
            { ` ${xpDetailString}` }
          </Text>
        )}
      </View>
    );
  }, [xpString, xpDetailString, typography, bigTextStyle]);
  if (!factionColor) {
    return null;
  }
  return (
    <View style={styles.borderWrapper}>
      <View style={[styles.wrapper, { backgroundColor: colors.faction[factionColor || 'neutral'].background }]}>
        <View style={styles.left}>
          <View style={TINY_PHONE ? styles.row : styles.row}>
            { mainLine }
            { xpLine }
          </View>
          <View style={styles.row}>
            { problemRow }
          </View>
        </View>
        <View style={[styles.right, controls && TINY_PHONE ? space.paddingTopS : undefined]}>
          { controls || (
            <>
              <TouchableOpacity onPress={showCardChartsPressed}>
                <View style={styles.button}>
                  <AppIcon name="chart" size={36} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={showDrawSimulatorPressed}>
                <View style={styles.button}>
                  <AppIcon name="draw" size={36} color="#FFFFFF" />
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
