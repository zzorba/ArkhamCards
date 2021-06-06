import React, { useContext, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { map, sumBy } from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DeckMergeItem from './DeckMergeItem';
import { Deck, getDeckId } from '@actions/types';
import space from '@styles/space';
import { CardsMap } from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';

interface Props {
  title: string;
  decks: Deck[];
  values: { [id: string]: boolean | undefined };
  inverted?: boolean;
  onValueChange: (deck: Deck, value: boolean) => void;
  investigators?: CardsMap;
  scenarioCount: {
    [key: string]: number;
  };
}

export default function DeckMergeSection({ title, decks, values, inverted, onValueChange, investigators, scenarioCount }: Props) {
  const { colors, borderStyle, typography } = useContext(StyleContext);
  const [open, toggleOpen] = useFlag(false);

  const items = useMemo(() => {
    return (
      <>
        { map(decks, deck => {
          const id = getDeckId(deck);
          return (
            <DeckMergeItem
              key={id.uuid}
              deck={deck}
              investigators={investigators}
              inverted={!!inverted}
              value={!!values[id.uuid]}
              onValueChange={onValueChange}
              scenarioCount={scenarioCount[id.uuid] || 1}
            />
          );
        }) }
      </>
    );
  }, [decks, inverted, scenarioCount, onValueChange, values, investigators]);

  const header = useMemo(() => {
    const selected = sumBy(decks, deck => {
      const id = getDeckId(deck);
      if (inverted) {
        return values[id.uuid] ? 0 : 1;
      }
      return values[id.uuid] ? 1 : 0;
    });
    return (
      <View style={[styles.headerRow, { backgroundColor: colors.L10 }, borderStyle, space.paddingS, space.paddingLeftM]}>
        <Text style={typography.small}>
          { title } ({selected} / {decks.length})
        </Text>
        { !inverted && (
          <View style={[styles.icon, space.marginSideS]}>
            <MaterialIcons
              name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.darkText}
            />
          </View>
        ) }
      </View>
    );
  }, [title, decks, values, inverted, open, borderStyle, colors, typography]);

  if (!decks.length) {
    return null;
  }
  if (!inverted) {
    return (
      <>
        <TouchableOpacity onPress={toggleOpen}>
          { header }
        </TouchableOpacity>
        <Collapsible collapsed={!open}>
          { items }
        </Collapsible>
      </>
    );
  }
  return (
    <>
      { header }
      { items }
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
