import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { PossibleAttachmentsCounts } from './AttachmentComponent';
import { useEligibleAttachments } from '@components/deck/DeckEditContext';
import Card from '@data/types/Card';

interface Props {
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
}

export function CardCount({ count, deltaCountMode, showZeroCount }: Props) {
  const { typography } = useContext(StyleContext);
  const countText = useMemo(() => {
    if (deltaCountMode) {
      if (count > 0) {
        return `+${count}`;
      }
      return `${count}`;
    }
    return `×${count}`;
  }, [count, deltaCountMode]);

  if (count !== 0 || showZeroCount) {
    return (
      <View style={styles.countWrapper}>
        <View style={styles.count}>
          <Text style={typography.text}>
            { countText }
          </Text>
        </View>
      </View>
    );
  }
  return null;
}


interface Props {
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
}

export function DeckCardCount({ count, card, deltaCountMode, showZeroCount }: Props & {
  card: Card;
}) {
  const attachments = useEligibleAttachments(card);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-end' }}>
      <PossibleAttachmentsCounts locked code={card.code} count={count} attachments={attachments} />
      <CardCount count={count} deltaCountMode={deltaCountMode} showZeroCount={showZeroCount} />
    </View>
  );

}

const styles = StyleSheet.create({
  countWrapper: {
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    marginLeft: xs,
    minWidth: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
