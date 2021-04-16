import React from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'ttag';

import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import { Deck, ParsedDeck } from '@actions/types';
import { CardsMap } from '@data/types/Card';
import { l, xs } from '@styles/space';
import RoundedFooterButton from '@components/core/RoundedFooterButton';

interface Props {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  editable: boolean;
  title?: string;
  onTitlePress?: (deck: ParsedDeck) => void;
  showDeckHistory?: () => void;
  tabooSetId?: number;
  singleCardView?: boolean;
}

export default function DeckProgressComponent({
  componentId,
  deck,
  cards,
  parsedDeck,
  editable,
  title,
  onTitlePress,
  showDeckHistory,
  tabooSetId,
  singleCardView,
}: Props) {
  if (!deck.previousDeckId && !deck.nextDeckId && !editable && !title) {
    return null;
  }

  // Actually compute the diffs.
  return (
    <View style={styles.container}>
      { !!(deck.previousDeckId) && (
        <ChangesFromPreviousDeck
          componentId={componentId}
          title={title}
          cards={cards}
          parsedDeck={parsedDeck}
          tabooSetId={tabooSetId}
          singleCardView={singleCardView}
          editable={editable}
          onTitlePress={onTitlePress}
          footerButton={!deck.nextDeckId && !!deck.previousDeckId && !!showDeckHistory && (
            <RoundedFooterButton
              icon="deck"
              title={t`Upgrade History`}
              onPress={showDeckHistory}
            />
          ) }
        />
      ) }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: xs,
    marginBottom: l,
  },
});
