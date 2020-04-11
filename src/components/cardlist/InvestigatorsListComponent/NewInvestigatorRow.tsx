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
import space, { xs } from 'styles/space';

interface Props {
  investigator: Card;
  cards: CardsMap;
  onPress?: (card: Card) => void;
}

export default class NewInvestigatorRow extends React.Component<Props> {
  _onPress = () => {
    const {
      onPress,
      investigator,
    } = this.props;
    onPress && onPress(investigator);
  };

  renderDeckbuildingDetails() {
    const {
      cards,
      investigator,
    } = this.props;
    if (!investigator.deck_requirements) {
      return null;
    }
    return (
      <>
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
      </>
    );
  }

  renderContent() {
    const {
      investigator,
    } = this.props;

    if (!investigator.deck_requirements) {
      return null;
    }
    return (
      <LinearGradient
        colors={FACTION_LIGHT_GRADIENTS[investigator.factionCode()]}
        style={styles.row}
      >
        <View style={space.marginS}>
          <InvestigatorImage card={investigator} />
        </View>
        <View style={styles.titleColumn}>
          <Text style={typography.text}>
            { investigator.name }
          </Text>
          { this.renderDeckbuildingDetails() }
        </View>
      </LinearGradient>
    );
  }

  render() {
    const {
      onPress,
    } = this.props;
    if (!onPress) {
      return this.renderContent();
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        { this.renderContent() }
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
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: xs,
    marginTop: xs,
    marginBottom: xs,
  },
});
