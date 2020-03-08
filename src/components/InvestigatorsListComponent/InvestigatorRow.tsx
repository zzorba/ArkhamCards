import React from 'react';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { t } from 'ttag';

import InvestigatorImage from 'components/core/InvestigatorImage';
import Card, { CardsMap } from 'data/Card';
import { FACTION_LIGHT_GRADIENTS } from 'constants';
import typography from 'styles/typography';

interface Props {
  investigator: Card;
  cards: CardsMap;
  onPress: (card: Card) => void;
}

export default class InvestigatorRow extends React.Component<Props> {
  _onPress = () => {
    const {
      onPress,
      investigator,
    } = this.props;
    onPress(investigator);
  };

  render() {
    const {
      cards,
      investigator,
    } = this.props;

    if (!investigator.deck_requirements) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this._onPress}>
        <LinearGradient
          colors={FACTION_LIGHT_GRADIENTS[investigator.factionCode()]}
          style={styles.row}
        >
          <View style={styles.image}>
            <InvestigatorImage card={investigator} />
          </View>
          <View style={styles.titleColumn}>
            <Text style={typography.text}>
              { investigator.name }
            </Text>
            <Text style={typography.text}>
              { t`${investigator.deck_requirements.size} Cards` }
            </Text>
            { map(investigator.deck_requirements.card, req => {
              const card = cards[req.code];
              if (!card) {
                return (
                  <Text key={req.code} style={typography.small}>
                    { t`Unknown card: ${req.code}` }
                  </Text>
                );
              }
              return (
                <Text key={req.code} style={typography.small}>
                  { card.quantity }x { card.name }
                </Text>
              );
            }) }
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  image: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 5,
    marginTop: 4,
    marginBottom: 4,
  },
});
