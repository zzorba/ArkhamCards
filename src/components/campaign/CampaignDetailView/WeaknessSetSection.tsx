import React, { useContext } from 'react';
import { filter, map, sum, values } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import { WeaknessSet } from '@actions/types';
import Card from '@data/types/Card';
import NavButton from '@components/core/NavButton';
import StyleContext from '@styles/StyleContext';
import { useWeaknessCards } from '@components/core/hooks';

interface Props {
  weaknessSet: WeaknessSet;
  showDrawDialog: () => void;
}


function computeCount(set: WeaknessSet, allCards: Card[]) {
  if (!set) {
    return {
      assigned: 0,
      total: 0,
    };
  }
  const packCodes = new Set(set.packCodes);
  const cards = filter(allCards, card => packCodes.has(card.pack_code));
  return {
    assigned: sum(values(set.assignedCards)),
    total: sum(map(cards, card => card.quantity)),
  };
}

export default function WeaknessSetSection({ weaknessSet, showDrawDialog }: Props) {
  const { typography } = useContext(StyleContext);
  const weaknessCards = useWeaknessCards();
  if (!weaknessCards) {
    return null;
  }
  const counts = computeCount(weaknessSet, weaknessCards);
  if (counts.total === 0) {
    return null;
  }
  return (
    <NavButton onPress={showDrawDialog}>
      <View style={styles.padding}>
        <Text style={typography.text}>
          { t`Basic Weakness Set` }
        </Text>
        <Text style={typography.small}>
          { t`${counts.assigned} / ${counts.total} have been drawn.` }
        </Text>
      </View>
    </NavButton>
  );
}

const styles = StyleSheet.create({
  padding: {
    padding: 6,
  },
});
