import React from 'react';
import { filter, map, sum, values } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';
import { WeaknessSet } from 'actions/types';
import typography from 'styles/typography';
import Card from 'data/Card';
import NavButton from 'components/core/NavButton';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';

interface OwnProps {
  fontScale: number;
  weaknessSet: WeaknessSet;
  showDrawDialog: () => void;
}

type Props = OwnProps & PlayerCardProps;

class WeaknessSetSection extends React.Component<Props> {
  static computeCount(set: WeaknessSet, allCards: Card[]) {
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

  render() {
    const {
      weaknessSet,
      weaknessCards,
      fontScale,
      showDrawDialog,
    } = this.props;
    const counts = WeaknessSetSection.computeCount(weaknessSet, weaknessCards);
    if (counts.total === 0) {
      return null;
    }
    return (
      <NavButton fontScale={fontScale} onPress={showDrawDialog}>
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
}

export default withPlayerCards<OwnProps>(WeaknessSetSection);

const styles = StyleSheet.create({
  padding: {
    padding: 6,
  },
});
